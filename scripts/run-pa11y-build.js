#!/usr/bin/env node
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3003;
const HOST = `http://localhost:${PORT}`;
const reportsDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

function runCmdSync(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

console.log('Starting static server (http-server via npx) on port', PORT);
// Resolve http-server executable: prefer local node_modules/.bin/http-server, else use npx (or npx.cmd on Windows)
let httpServerCmd = null;
let httpServerArgs = ['build', '-p', String(PORT)];
const localHttp = path.join(__dirname, '..', 'node_modules', '.bin', process.platform === 'win32' ? 'http-server.cmd' : 'http-server');
if (fs.existsSync(localHttp)) {
  httpServerCmd = localHttp;
} else {
  httpServerCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  httpServerArgs = ['http-server', 'build', '-p', String(PORT)];
}

const server = spawn(httpServerCmd, httpServerArgs, { stdio: 'inherit' });

// Give the server a bit to start
function wait(ms) { return new Promise((res) => setTimeout(res, ms)); }

async function run() {
  try {
    // Wait until server likely started
    await wait(1500);

    const routes = ['/', '/contact', '/accessibility-statement'];
    for (const route of routes) {
      const safeName = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
      const htmlPath = path.join(reportsDir, `pa11y-build-${safeName}.html`);
      const errPath = path.join(reportsDir, `pa11y-build-${safeName}.err`);
      const url = `${HOST}${route}`;
      console.log(`Running pa11y for ${url} -> ${htmlPath}`);
      try {
        const out = runCmdSync(`npx pa11y ${url} --reporter html`);
        fs.writeFileSync(htmlPath, out, 'utf8');
        fs.writeFileSync(errPath, '', 'utf8');
        console.log(`Saved ${htmlPath}`);
      } catch (err) {
        // err.stdout / err.stderr might be available
        try {
          if (err.stdout) fs.writeFileSync(htmlPath, err.stdout, 'utf8');
        } catch (e) {}
        const msg = (err.stderr || err.message || String(err));
        fs.writeFileSync(errPath, msg, 'utf8');
        console.error(`pa11y failed for ${url}: see ${errPath}`);
      }
    }
  } finally {
    console.log('Shutting down static server');
    try { server.kill(); } catch (e) {}
    process.exit(0);
  }
}

run();
