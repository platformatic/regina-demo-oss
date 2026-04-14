# Regina Demo

Demo applications for Regina — AI agent orchestrator for Platformatic Watt.

## Setup

Run `docker compose up -d` to start the Valkey server

```bash
cp .env.sample .env
# Edit .npmrc and set your npm token
# Edit .env and set your AI_GATEWAY_API_KEY

npm install
npm run dev
```

## Run production build

```bash
cd services/web
npm run build
cd ../..
npm start
```

## Web UI

Visit `http://0.0.0.0/web` to check the NextJS app, calling Regina API

## CLI

```bash
# List agents
curl http://0.0.0.0:3042/regina/agents

# Spawn a weather agent
curl -X POST http://0.0.0.0:3042/regina/agents/weather/instances
# Returns { "instanceId": "weather-a1b2c3", ... }

# Chat
curl -X POST http://0.0.0.0:3042/regina/instances/weather-a1b2c3/chat \
  -H 'Content-Type: application/json' \
  -d '{"message": "What is the weather in London?"}'

# Spawn a github agent
curl -X POST http://0.0.0.0:3042/regina/agents/github/instances
# Returns { "instanceId": "github-a1b2c3", ... }

# Chat
curl -X POST http://0.0.0.0:3042/regina/instances/github-a1b2c3/chat \
  -H 'Content-Type: application/json' \
  -d '{"message": "Tell me about the platformatic/platformatic repo"}'
```

