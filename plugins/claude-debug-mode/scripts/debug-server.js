#!/usr/bin/env node

/**
 * Debug Server for Hypothesis-Based Debugging
 *
 * Receives debug logs via HTTP POST and writes them to NDJSON file.
 * Supports CORS for browser-based debugging.
 *
 * Usage:
 *   node debug-server.js [port] [logfile]
 *
 * Defaults:
 *   port: 3947
 *   logfile: .claude-logs/debug.ndjson
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2]) || 3947;
const LOG_DIR = '.claude-logs';
const LOG_FILE = process.argv[3] || path.join(LOG_DIR, 'debug.ndjson');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Clear log file on start
fs.writeFileSync(LOG_FILE, '');

let logCount = 0;

const server = http.createServer((req, res) => {
  // CORS headers for browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', logCount, port: PORT }));
    return;
  }

  // Get logs endpoint
  if (req.url === '/logs' && req.method === 'GET') {
    try {
      const logs = fs.existsSync(LOG_FILE)
        ? fs.readFileSync(LOG_FILE, 'utf-8')
        : '';
      res.writeHead(200, { 'Content-Type': 'application/x-ndjson' });
      res.end(logs);
    } catch (e) {
      res.writeHead(500);
      res.end('Error reading logs');
    }
    return;
  }

  // Clear logs endpoint
  if (req.url === '/clear' && req.method === 'POST') {
    fs.writeFileSync(LOG_FILE, '');
    logCount = 0;
    res.writeHead(200);
    res.end('Logs cleared');
    return;
  }

  // Debug log endpoint
  if (req.url === '/debug' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        // Add server-side metadata
        data.id = data.id || `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        data.serverTimestamp = Date.now();

        // Append to log file
        fs.appendFileSync(LOG_FILE, JSON.stringify(data) + '\n');
        logCount++;

        // Console output for visibility
        const hyp = data.hypothesisId ? `[${data.hypothesisId}]` : '';
        console.log(`[${logCount}] ${hyp} ${data.location}: ${data.message}`);

        res.writeHead(200);
        res.end('ok');
      } catch (e) {
        console.error('Invalid JSON:', e.message);
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
    return;
  }

  // 404 for unknown routes
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║           Hypothesis Debug Server Running                ║
╠══════════════════════════════════════════════════════════╣
║  Port:     ${PORT.toString().padEnd(44)}║
║  Log file: ${LOG_FILE.padEnd(44)}║
╠══════════════════════════════════════════════════════════╣
║  Endpoints:                                              ║
║    POST /debug  - Receive debug logs                     ║
║    GET  /health - Health check                           ║
║    GET  /logs   - Retrieve all logs                      ║
║    POST /clear  - Clear log file                         ║
╠══════════════════════════════════════════════════════════╣
║  Press Ctrl+C to stop                                    ║
╚══════════════════════════════════════════════════════════╝
`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down debug server...');
  server.close(() => {
    console.log(`Total logs received: ${logCount}`);
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
