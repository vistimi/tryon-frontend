# Tryon frontend

```bash
yarn dev
yarn build
yarn start
yarn lint
```

### .env

NEXT_PUBLIC_API_URL requires localhost even in devcontainer because the request is made from the navigator.
But inside a container you need to use the backend container name.

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```