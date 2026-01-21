# Claude Debug Mode

A hypothesis-based debugging skill for Claude Code, inspired by Cursor's Debug Mode. Uses runtime evidence and systematic hypothesis testing to identify and fix bugs.

## Installation

### From GitHub (recommended)

```bash
/plugin marketplace add kerdofficial/claude-debug-mode
/plugin install claude-debug-mode@kerd-debug-mode
```

## How It Works

This skill implements a systematic debugging methodology:

1. **Hypothesis Generation** - Generate 3-5 specific hypotheses about the bug
2. **Code Instrumentation** - Add targeted logging tied to each hypothesis
3. **Reproduction** - User triggers the bug to collect runtime data
4. **Log Analysis** - Evaluate hypotheses as CONFIRMED/REJECTED/INCONCLUSIVE
5. **Targeted Fix** - Apply minimal fix based on confirmed root cause
6. **Verification** - Re-run with post-fix logging to prove the fix works
7. **Cleanup** - Remove instrumentation after verified success

## Key Principles

- **NEVER** fix code without runtime evidence
- **NEVER** remove instrumentation before fix is verified
- **ALWAYS** generate 3-5 hypotheses before instrumenting
- **ALWAYS** use `#region agent log` markers for easy cleanup

## Usage

Simply ask Claude Code to debug something:

- "Help me debug this function"
- "Debug this - the API returns null sometimes"
- "Why isn't this working?"
- "Find this bug in the authentication flow"

Claude will automatically use the hypothesis-based methodology.

## Log Format

Logs are stored in NDJSON format at `.claude-logs/debug.ndjson`:

```json
{
  "id": "log_1733456789_abc1",
  "timestamp": 1733456789000,
  "location": "file.js:15",
  "message": "Function entry",
  "data": { "param": "value" },
  "sessionId": "debug-session",
  "runId": "initial",
  "hypothesisId": "A"
}
```

## Multi-Language Support

| Language | Logging Method | Template |
|----------|---------------|----------|
| JavaScript/TypeScript | HTTP POST to local server | `fetch('http://127.0.0.1:3947/debug', ...)` |
| Python | File append | `with open('.claude-logs/debug.ndjson', 'a')` |
| Go | File append with mutex | Thread-safe file write |
| Rust | File append with mutex | Thread-safe file write |
| Bash | Echo to file | `echo "{...}" >> .claude-logs/debug.ndjson` |

See `skills/debug-mode/references/instrumentation-templates.md` for full templates.

## Debug Server

For JavaScript/TypeScript projects, a debug server is included:

```bash
# Start server
node scripts/debug-server.js 3947

# Endpoints
POST /debug  - Receive debug logs
GET  /health - Health check
GET  /logs   - Retrieve all logs
POST /clear  - Clear log file
```

## Hypothesis Evaluation

After reproduction, Claude evaluates each hypothesis:

| Status | Meaning |
|--------|---------|
| **CONFIRMED** | Logs prove this is the root cause |
| **REJECTED** | Logs prove this is NOT the cause |
| **INCONCLUSIVE** | Need more instrumentation |

Example output:

```
## Hypothesis Evaluation

| Hypothesis | Status | Evidence |
|------------|--------|----------|
| A: Wrong param types | REJECTED | Log #1-3: All params are numbers |
| B: a===0 returns undefined | CONFIRMED | Log #5-6: Returns undefined when a===0 |
| C: Calculation error | REJECTED | Log #4: 5+3=8 is correct |

**Root Cause:** Hypothesis B confirmed.
```

## Directory Structure

```
claude-debug/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── skills/
│   └── debug-mode/
│       ├── SKILL.md          # Main skill (loaded on trigger)
│       └── references/
│           ├── instrumentation-templates.md  # Language templates
│           └── hypothesis-workflow.md        # Detailed methodology
├── scripts/
│   └── debug-server.js       # HTTP debug server
└── README.md
```