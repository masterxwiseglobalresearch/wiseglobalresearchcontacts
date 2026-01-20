const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 56900;

const buildDir = path.join(__dirname, '..', 'build');

app.use(express.static(buildDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serving build from ${buildDir} at http://localhost:${PORT}`);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down static server');
  process.exit(0);
});
