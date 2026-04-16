# Ollama + Claude Code — Quick Integration Guide

This document shows how to use a locally-run Ollama model with a Claude Code workflow (or any tool that can call a local HTTP API).

Summary steps:
- Start Ollama (server mode) or run a model interactively.
- Use the Ollama HTTP API (default: `http://127.0.0.1:11434`) to send generate requests.
- If your integration requires "tools" support, confirm the model supports it; otherwise choose a compatible model.

### 1) Start Ollama / run a model

- Run the server (preferred for programmatic access):

```powershell
ollama serve
```

- Or run a single model interactively:

```powershell
ollama run deepseek-coder:6.7b
```

Use `ollama ps` or `ollama list` to inspect running models and available images.

### 2) Local API endpoint

- Base URL: `http://127.0.0.1:11434`
- Common generation endpoint: `POST /api/generate`

Example curl request:

```bash
curl -s -X POST "http://127.0.0.1:11434/api/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-coder:6.7b",
    "prompt": "Write a short friendly greeting",
    "max_tokens": 128
  }'
```

Node fetch example:

```js
import fetch from 'node-fetch';

const res = await fetch('http://127.0.0.1:11434/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'deepseek-coder:6.7b',
    prompt: 'Write a short friendly greeting',
    max_tokens: 128
  })
});

const data = await res.json();
console.log(data);
```

### 3) Integrating with Claude Code

- If you are using a wrapper named "Claude Code" that expects a model endpoint, point it to the Ollama server: `http://127.0.0.1:11434` and set the model name to the Ollama model identifier (for example, `deepseek-coder:6.7b`).
- Example integration note for a config file:

```yaml
model:
  endpoint: "http://127.0.0.1:11434"
  name: "deepseek-coder:6.7b"
```

- Important: some Ollama models do not support "tools" (tooling hooks invoked by orchestrators). If your Claude Code workflow requires tool integrations, test the model first with a simple request and check for errors like "does not support tools". If you see that error, pick a model that provides the needed features (try models listed by `ollama list`).

### 4) Running Ollama in background (Windows)

- Simple PowerShell background start (non-blocking):

```powershell
Start-Process -NoNewWindow -FilePath "ollama" -ArgumentList "serve"
```

- Or run inside a terminal multiplexer / separate shell and keep it open.

### 5) Troubleshooting

- Error: `... does not support tools` — the model lacks tool support; switch to a different model or change the integration to not require tools.
- If `ollama serve` fails to bind port 11434, list running models or processes with `ollama ps` and `netstat` to find which process is using the port.

### 6) Quick test checklist

1. `ollama list` — find the model name.
2. `ollama serve` — start the HTTP server.
3. Run the curl example above — confirm you get a JSON response.
4. Point your Claude Code integration to `http://127.0.0.1:11434` with the model name.

---

If you want, I can:
- start `ollama serve` in the background here,
- run the curl test for `deepseek-coder:6.7b`, and
- if the model returns a "does not support tools" error, re-run tests with `qwen2.5-coder:7b`.

Tell me which of those steps you want me to run now.
