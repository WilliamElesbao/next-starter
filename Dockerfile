FROM oven/bun:1.3.3
WORKDIR /app

RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 bunjs

USER bunjs

COPY --chown=bunjs:bunjs .next/standalone ./
COPY --chown=bunjs:bunjs .next/static ./.next/static
COPY --chown=bunjs:bunjs public ./public

EXPOSE 3000

CMD ["bun", "./server.js"]