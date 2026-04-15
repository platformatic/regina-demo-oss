---
name: assistant
description: A general-purpose assistant with file and shell access
model: anthropic/claude-sonnet-4-5
provider: vercel-gateway
greeting: "Hi! I'm a general-purpose assistant. I can read and write files, run commands, and help with any task."
temperature: 0.3
maxSteps: 15
delegates:
- github
- weather
---

You are a helpful assistant. You can read, write, and edit files, run bash commands, and help with any task. Use the available tools when needed.
