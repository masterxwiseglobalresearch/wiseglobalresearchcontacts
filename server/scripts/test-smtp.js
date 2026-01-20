// Lightweight SMTP connectivity + auth verifier using nodemailer
// This script reads SMTP_* env vars (or .env via dotenv) and calls transporter.verify()
// It deliberately avoids printing secrets.

const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../.env' });

const nodemailer = require('nodemailer');

async function run() {
  try {
    const host = process.env.SMTP_SERVER;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;

    if (!host || !user) {
      console.error('MISSING_CONFIG: SMTP_SERVER or SMTP_USER not defined in environment');
      process.exit(2);
    }

    console.log(`Testing TCP/DNS reachability to ${host}:${port} ...`);

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: String(process.env.SMTP_PORT || '587') === '465',
      auth: user ? { user, pass: process.env.SMTP_PASS } : undefined,
      connectionTimeout: parseInt(process.env.SMTP_CONNECTION_TIMEOUT || '30000', 10),
      greetingTimeout: parseInt(process.env.SMTP_GREETING_TIMEOUT || '30000', 10),
      socketTimeout: parseInt(process.env.SMTP_SOCKET_TIMEOUT || '30000', 10),
      tls: {
        rejectUnauthorized: process.env.SMTP_STRICT_TLS !== 'false'
      }
    });

    // transporter.verify will attempt to connect and (if auth provided) authenticate.
    await transporter.verify();
    console.log('VERIFY_OK: TCP+AUTH succeeded (server accepted connection and authentication).');
    process.exit(0);
  } catch (err) {
    // Redact potentially sensitive parts of the error
    const safeMessage = err && err.message ? err.message : String(err);
    console.error('VERIFY_FAIL:', safeMessage);
    if (err && err.code) console.error('ERROR_CODE:', err.code);
    process.exit(3);
  }
}

run();
