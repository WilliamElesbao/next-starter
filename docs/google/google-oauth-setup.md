# Google OAuth Setup

This guide configures Google OAuth for BetterAuth in Next Starter.

## 1) Create or select a Google Cloud project

1. Open https://console.cloud.google.com/.
2. Create a dedicated project for local/staging usage.
3. Open **APIs & Services**.

## 2) Configure OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**.
2. Configure app name and support email.
3. Add test users if the app is in testing mode.
4. Save.

## 3) Create OAuth client credentials

1. Go to **APIs & Services → Credentials**.
2. Click **Create credentials → OAuth client ID**.
3. Choose **Web application**.
4. Configure:
   - **Name**: A descriptive name (e.g., "Next Starter - Local Development")
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
5. Click **Create**.
6. Copy the generated **Client ID** and **Client Secret**.

## 4) Configure environment variables

Add the credentials to your `.env` file:

```dotenv
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

Also verify these base URL settings:

```dotenv
NEXT_PUBLIC_BASE_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
```

## 5) Production setup

For production deployment:

1. Return to **APIs & Services → Credentials**
2. Edit your OAuth client or create a new one
3. Add production URLs:
   - **Authorized JavaScript origins**: `https://your-domain.com`
   - **Authorized redirect URIs**: `https://your-domain.com/api/auth/callback/google`
4. Update your production `.env` with the same credentials

## References

- **BetterAuth Google Provider**: https://better-auth.com/docs/authentication/google
- **Google OAuth 2.0**: https://developers.google.com/identity/protocols/oauth2
- **Google Cloud Console**: https://console.cloud.google.com/
