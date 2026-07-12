#!/bin/bash
# Post-create script that runs after the container is created

set -e

echo "🚀 Starting post-create command script..."
uname -a
echo ""

echo "📥 Updating package lists..."
if command -v sudo &> /dev/null; then
    sudo apt-get update -qq
else
    apt-get update -qq
fi

# Install Bun (package manager and runtime)
echo "🍞 Installing Bun..."
if ! command -v bun &> /dev/null; then
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    echo "export BUN_INSTALL=\"\$HOME/.bun\"" >> ~/.bashrc
    echo "export PATH=\"\$BUN_INSTALL/bin:\$PATH\"" >> ~/.bashrc

    # Symlink into /usr/local/bin so non-interactive shells (e.g. git hooks
    # run by Husky) can find bun/bunx even without sourcing ~/.bashrc.
    sudo ln -sf "$HOME/.bun/bin/bun" /usr/local/bin/bun
    sudo ln -sf "$HOME/.bun/bin/bunx" /usr/local/bin/bunx

    echo "✅ Bun installed: $(bun --version)"
else
    echo "✅ Bun already installed: $(bun --version)"
fi

echo ""
echo "🔍 Verifying installations..."
echo "Bun: $(bun --version)"
echo "Node.js: $(node --version)"
command -v git &> /dev/null && echo "Git: $(git --version)" || echo "⚠️  Git not found"
command -v java &> /dev/null && echo "Java: $(java --version | head -1)" || echo "⚠️  Java not found (SonarLint won't work)"

# Install project dependencies
if [ -f "package.json" ]; then
    echo ""
    echo "📦 Installing project dependencies with Bun..."
    bun install
    echo "✅ Dependencies installed"
fi

# Generate Prisma client and apply migrations (database is up via compose)
if [ -f "prisma/schema.prisma" ]; then
    echo ""
    echo "🗄️  Setting up database..."
    bun run db:generate
    bun run db:migrate
fi

# Git config reminder
if ! git config --global user.name &> /dev/null; then
    echo ""
    echo "⚙️  Git not configured. You may want to run:"
    echo "   git config --global user.name 'Your Name'"
    echo "   git config --global user.email 'your.email@example.com'"
fi

echo ""
echo "✨ ========================================="
echo "✨ Dev container is ready!"
echo "✨ ========================================="
echo ""
echo "📝 Quick Start:"
echo "   1. Configure your .env (DATABASE_URL, STRIPE_*, GOOGLE_*, etc.)"
echo "   2. Run 'bun run db:migrate' to apply migrations"
echo "   3. Run 'bun dev' to start the Next.js dev server on port 3000"
echo "   4. Stripe webhooks locally: 'stripe listen --forward-to localhost:3000/api/auth/stripe/webhook'"
echo ""