# Regina Demo

Demo applications for Regina — AI agent orchestrator for Platformatic Watt.

## Setup

```bash
cp .env.sample .env
# Edit .npmrc and set your npm token
# Edit .env and set your AI_GATEWAY_API_KEY

npm install
npx wattpm@latest start
```

### Usage

```bash
# List agents
curl http://127.0.0.1:3042/agents

# Spawn a weather agent
curl -X POST http://127.0.0.1:3042/agents/weather/instances
# Returns { "instanceId": "weather-a1b2c3", ... }

# Chat
curl -X POST http://127.0.0.1:3042/instances/weather-a1b2c3/chat \
  -H 'Content-Type: application/json' \
  -d '{"message": "What is the weather in London?"}'

# Spawn a github agent
curl -X POST http://127.0.0.1:3042/agents/github/instances
# Returns { "instanceId": "github-a1b2c3", ... }

# Chat
curl -X POST http://127.0.0.1:3042/instances/github-a1b2c3/chat \
  -H 'Content-Type: application/json' \
  -d '{"message": "Tell me about the platformatic/platformatic repo"}'
```

