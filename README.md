# Tryon frontend

Try-on with swiping
![Try-on](images/swiping.png)

### commands

```bash
yarn dev
yarn build
yarn start
yarn lint
```

### .env

AI_URL requires localhost even in devcontainer because the request is made from the navigator.
But inside a container you need to use the backend container name.

```bash
AI_URL=http://localhost:8080
```