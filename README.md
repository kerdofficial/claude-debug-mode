# Claude Debug Mode Plugin

A hypothesis-based debugging skill for Claude Code, inspired by Cursor's Debug Mode. Uses runtime evidence and systematic hypothesis testing to identify and fix bugs.

## Installation

```bash
/plugin marketplace add kerdofficial/claude-debug-mode
/plugin install claude-debug-mode@kerd-debug-mode
```

## How It Works

When you ask Claude to debug your code, it will:

1. **Think of possible causes** - Generate several hypotheses about what might be wrong
2. **Add logging** - Insert temporary logs in your code to test each hypothesis
3. **Ask you to run it** - You reproduce the bug while logs collect data
4. **Analyze the evidence** - Claude reads the logs and identifies the actual cause
5. **Fix it** - Apply a targeted fix based on real data
6. **Verify** - You test again to confirm it works
7. **Clean up** - Remove all the temporary logging code

## Usage

Simply ask Claude Code to debug something:

- "Help me debug this function"
- "Debug this - the API returns null sometimes"
- "Why isn't this working?"
- "Find this bug in the authentication flow"

or just simply use the `/debug-mode` command and describe the bug, for example:

```bash
/debug-mode We have a bug in the inventory management system. When we try to reorder an item, it returns the wrong quantity.
```

## License

MIT License

Copyright (c) 2026 Kerekes Dániel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
