# Tryon frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with Bun.

```bash
yarn dev
yarn build
yarn start
yarn lint
```

### Bun (not working)

```json
"devDependencies": {
    "bun-framework-next": "^12.2",
    "bun-types": "^0.5.7",
  }
```

### .env

NEXT_PUBLIC_API_URL requires localhost even in devcontainer because the request is made from the navigator.

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Webhook
[Github tutorial](https://docs.github.com/en/webhooks-and-events/webhooks/creating-webhooks#exposing-localhost-to-the-internet)

```bash
ngrok http 4567
```

### Oauth
Metadata: Read-only
Contents: Read and write