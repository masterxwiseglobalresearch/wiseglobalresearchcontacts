#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// This script conditionally runs `npm --prefix .. run build --if-present`
// It is used as a safer postinstall hook for the server package so that
// install does not fail on platforms that don't install or expose
// the frontend dependencies (e.g. react-scripts).

const rootPkg = path.join(__dirname, '..', '..', 'package.json');

function safeRun() {
  try {
    if (!fs.existsSync(rootPkg)) {
      console.log('Root package.json not found; skipping client build.');
      return;
    }
    const pkg = JSON.parse(fs.readFileSync(rootPkg, 'utf8'));

    // Allow forcing the build via env var (useful in CI)
    if (process.env.RUN_CLIENT_BUILD === '1') {
      console.log('RUN_CLIENT_BUILD=1; running client build...');
      execSync('npm --prefix .. run build --if-present', { stdio: 'inherit' });
      return;
    }

    // If react-scripts is declared in root dependencies or devDependencies, try to run build
    const hasReactScripts = (
      (pkg.dependencies && pkg.dependencies['react-scripts']) ||
      (pkg.devDependencies && pkg.devDependencies['react-scripts'])
    );

    if (!hasReactScripts) {
      console.log('react-scripts not found in root package.json; skipping client build.');
      return;
    }

    // If running in a hosted build environment like Render, the root
    // dependencies may not be installed during the server package install.
    // Many hosts set `RENDER` or `CI` env vars — if detected, skip the client build.
    if (process.env.RENDER || process.env.CI) {
      console.log('Detected CI/Render environment; skipping client build.');
      return;
    }

    // Ensure react-scripts is actually installed in the root's node_modules.
    // Using require.resolve can give false positives in some CI/container setups
    // where the package.json declares the dependency but the module hasn't been
    // installed yet. Checking for the installed folder avoids invoking the
    // client build when react-scripts isn't present.
    const rootNodeModules = path.join(__dirname, '..', '..', 'node_modules');
    if (!fs.existsSync(path.join(rootNodeModules, 'react-scripts'))) {
      console.log('react-scripts not installed in root node_modules; skipping client build.');
      return;
    }

    console.log('Invoking client build: npm --prefix .. run build --if-present');
    execSync('npm --prefix .. run build --if-present', { stdio: 'inherit' });
  } catch (err) {
    console.warn('Conditional client build failed, but install will continue:', err && err.message ? err.message : err);
  }
}

safeRun();
