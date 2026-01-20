const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const admin = require('firebase-admin');
const { z } = require('zod');
const nodemailer = require('nodemailer');
// AWS SES v3 client - used as a fallback when SMTP repeatedly times out from some hosting providers
let SESClient;
let SendEmailCommand;
let SendRawEmailCommand;
try {
  const awsSes = require('@aws-sdk/client-ses');
  SESClient = awsSes.SESClient;
  SendEmailCommand = awsSes.SendEmailCommand;
  SendRawEmailCommand = awsSes.SendRawEmailCommand;
} catch (e) {
  // Dependency may not be installed in some environments; we'll only attempt SES fallback when available
  SESClient = null;
  SendEmailCommand = null;
  SendRawEmailCommand = null;
}
// Notes:
// - When AWS credentials are available, server prefers SES Raw API (SendRawEmail) which supports attachments.
// - When attachments are absent, SES SendEmail (non-raw) may be used as a simpler path.
// - In development (NODE_ENV !== 'production') Ethereal is used for preview when no AWS creds are available.
const multer = require('multer');
// Increase default upload limit to 20MB to accommodate larger resumes
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
// NOTE: We intentionally avoid X-Frame-Options (deprecated in favour of CSP frame-ancestors)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

// Middleware
// If behind a proxy (e.g., Render), trust it so correct proto/host are detected
app.set('trust proxy', 1);

// DEVELOPMENT-FRIENDLY CORS: when running locally, explicitly add permissive
// CORS headers for common dev origins (localhost:3000 etc). This is only
// applied when NODE_ENV !== 'production' so production CSP/CORS rules remain
// controlled by the main cors middleware above.
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    try {
      const origin = req.get('Origin') || '';
      // Allow if no origin (curl/server) or if origin is localhost/127.0.0.1:3000
      if (!origin || /^(https?:)?\/\/localhost(?::3000)?$/.test(origin) || /^(https?:)?\/\/127\.0\.0\.1(?::3000)?$/.test(origin)) {
        // Mirror the Origin when present to satisfy browsers that require exact match
        res.setHeader('Access-Control-Allow-Origin', origin || 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,HEAD');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        res.setHeader('Access-Control-Expose-Headers', 'Server-Timing');
        res.setHeader('Access-Control-Allow-Credentials', 'false');
      }
      // Short-circuit preflight
      if (req.method === 'OPTIONS') return res.sendStatus(200);
    } catch (e) {
      // If anything goes wrong here, don't block the request - let the normal CORS middleware handle it
      console.debug('Dev CORS middleware error:', e && e.message ? e.message : e);
    }
    next();
  });
}

// Configure CORS to properly respond to preflight requests
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://192.168.1.138:3001',
  'https://web-wiseglobalresearch.web.app',
  'https://wiseglobalresearch.com',
  'https://www.wiseglobalresearch.com',
  'https://wise-globle-research-2.onrender.com',
  'https://www.wise-globle-research-2.onrender.com',
];

// More forgiving CORS checker with diagnostics. We intentionally allow
// requests with no Origin (curl, mobile-native) while validating common
// browser origins. We also broaden allowed headers to include typical
// fetch/XHR headers used by browsers and third-party analytics.
const corsOptions = {
  origin: function (origin, callback) {
    try {
      // If no origin (server-to-server, curl, some mobile clients), allow
      if (!origin) {
        console.debug('CORS: no origin provided - allowing');
        return callback(null, true);
      }

      // Normalize origin by stripping trailing slash
      const normalized = origin.replace(/\/$/, '');

      // Quick allow-list check
      if (allowedOrigins.includes(normalized)) {
        console.debug(`CORS: origin allowed by exact match: ${normalized}`);
        return callback(null, true);
      }

      // Accept any subdomain on render.com (e.g., mrxads-2.onrender.com)
      try {
        const hostname = new URL(normalized).hostname;
        if (/onrender\.com$/.test(hostname)) {
          console.debug(`CORS: origin allowed by onrender rule: ${normalized}`);
          return callback(null, true);
        }
      } catch (err) {
        // If URL parsing fails, fall through to rejection
      }

      console.warn(`CORS: rejecting origin ${normalized}`);
      callback(new Error('Not allowed by CORS'));
    } catch (e) {
      console.error('CORS origin check error:', e && e.message);
      // Fail open for safety in environments where origin parsing unexpectedly fails
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
  // Browser will often send these headers; include common ones to avoid
  // preflight rejections.
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Server-Timing'],
  credentials: false,
  // Some browsers expect 200 for preflight; use 200 for better compatibility
  optionsSuccessStatus: 200,
};

app.use((req, res, next) => {
  // Ensure CORS middleware runs early and log origin for diagnostics
  const origin = req.header('Origin') || 'no-origin';
  console.debug(`Incoming request origin: ${origin} ${req.method} ${req.path}`);
  next();
});

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Diagnostics: measure server processing time and expose via Server-Timing header
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  // after response finished, compute delta and set Server-Timing header
  res.once('finish', () => {
    try {
      const deltaMs = Number(process.hrtime.bigint() - start) / 1e6;
      // append Server-Timing if headers haven't been sent earlier
      try {
        res.setHeader('Server-Timing', `app;dur=${deltaMs.toFixed(2)}`);
      } catch (e) {
        // headers may already have been sent; ignore
      }
      console.debug(`${req.method} ${req.originalUrl} - server processing ${deltaMs.toFixed(2)}ms`);
    } catch (err) {
      // ignore measurement errors
    }
  });
  next();
});

// Ensure API responses include a Content-Type header when handlers don't set one.
// This addresses audit warnings that some responses were missing a Content-Type.
app.use((req, res, next) => {
  // Only apply to API routes and JSON responses from the server
  const origJson = res.json;
  res.json = function patchedJson(body) {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    return origJson.call(this, body);
  };
  next();
});

// Optional compression: use if the 'compression' package is installed.
// This is wrapped in try/catch so the server won't fail if compression is not installed in the environment.
try {
  const compression = require('compression');
  app.use(compression());
  console.debug('Compression middleware enabled');
} catch (e) {
  console.debug('compression package not installed; skipping compression middleware');
}

// Serve React build (if present). This allows the same server to serve
// the frontend static files when deployed (e.g., Render). Try a couple
// of likely locations because deployment environments may set the
// process working directory differently.
const candidateBuildPaths = [
  path.join(__dirname, '..', 'build'), // repository root build/
  path.join(process.cwd(), 'build'),   // current working directory build/
];

let resolvedBuildPath = null;
for (const p of candidateBuildPaths) {
  if (fs.existsSync(p)) {
    resolvedBuildPath = p;
    break;
  }
}

if (resolvedBuildPath) {
  // Serve static files with a long cache for fingerprinted assets (cache busting by filename)
  app.use(express.static(resolvedBuildPath, {
    setHeaders: (res, path) => {
      if (/\.[0-9a-f]{8,}\.\w+$/.test(path)) {
        // Fingerprinted asset - can be cached long-term
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));

  // Serve index.html on the root and for any non-API routes to support
  // client-side routing. Keep API routes and health checks untouched.
  app.get('/', (req, res) => res.sendFile(path.join(resolvedBuildPath, 'index.html')));

  app.get('*', (req, res, next) => {
    // Let API and special endpoints be handled by existing routes
    // Ensure our debug endpoints are not swallowed by the SPA index fallback
    if (
      req.path.startsWith('/api') ||
      req.path === '/health' ||
      req.path.startsWith('/send-email') ||
      req.path.startsWith('/submit-popup') ||
      req.path === '/smtp-check' ||
      req.path === '/send-email-debug'
    ) {
      return next();
    }
    res.sendFile(path.join(resolvedBuildPath, 'index.html'));
  });
} else {
  // Fallback: when no build exists in the deployed app, return a helpful
  // message at root rather than an opaque 404 so the deploy logs make sense.
  // Diagnostic helper: produce a short directory listing for logs
  function shortDirListing(p, maxEntries = 20) {
    try {
      if (!fs.existsSync(p)) return `${p} - not found`;
      const items = fs.readdirSync(p).slice(0, maxEntries);
      return `${p}: ${items.join(', ')}${items.length === maxEntries ? ', ...' : ''}`;
    } catch (e) {
      return `${p}: error reading (${e.message})`;
    }
  }

  // Log diagnostic information immediately so Render's deploy logs contain it
  try {
    console.warn('STATIC BUILD NOT FOUND - diagnostic info:');
    console.warn('Candidate build paths:', candidateBuildPaths.join(' | '));
    console.warn('process.cwd():', process.cwd());
    console.warn('__dirname:', __dirname);
    console.warn('Root listing:', shortDirListing(path.join(__dirname, '..')));
    console.warn('Working dir listing:', shortDirListing(process.cwd()));
    console.warn('public/:', shortDirListing(path.join(__dirname, '..', 'public')));
    console.warn('build/:', shortDirListing(path.join(__dirname, '..', 'build')));
  } catch (e) {
    console.warn('Error while logging build diagnostic info:', e && e.message);
  }

  app.get('/', (req, res) => {
    res.status(200).send('Server is running, but static frontend (build/) is missing. Please run `npm run build` or configure the deploy to build the frontend.');
  });
}

// ---------------------------------------------------------------------------
// Security & Compatibility Headers Middleware
// ---------------------------------------------------------------------------
app.use((req, res, next) => {
  // Content negotiation is handled by express.json / res.json; ensure charset for any text/html responses
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', "camera=(), microphone=(), geolocation=(), fullscreen=* ");
  // Only set a Content-Security-Policy for HTML responses to avoid adding it to API/json responses
  const wantsHtml = req.accepts && req.accepts('html') && !req.path.startsWith('/api');
  // A pragmatic CSP allowing required third‑party embeds; tighten further if possible
  const csp = [
    "default-src 'self'",
    "script-src 'self' https://www.googletagmanager.com https://s3.tradingview.com 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    // Allow connections needed by Firebase Auth / RTDB and common Google APIs
  "connect-src 'self' https://www.googletagmanager.com https://s3.tradingview.com https://widget.myfxbook.com https://fonts.googleapis.com https://fonts.gstatic.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://www.gstatic.com https://firebasestorage.googleapis.com wss://*.firebaseio.com wss://*.firebasedatabase.app",
    "frame-src https://www.youtube-nocookie.com https://www.tradingview.com https://s.tradingview.com https://widget.myfxbook.com",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  if (wantsHtml) {
    res.setHeader('Content-Security-Policy', csp);
  }
  // Avoid deprecated headers flagged by audit (no P3P, Pragma, X-Frame-Options etc.)

  // Cache policy: avoid aggressive directives like 'must-revalidate' and prefer stale-while-revalidate
  if (req.path === '/health') {
    // Health endpoint should not be cached long-term; keep short no-cache directive
    res.setHeader('Cache-Control', 'no-cache, max-age=0');
  } else if (req.path.startsWith('/api/')) {
    // API responses are private and not cached by CDNs
    res.setHeader('Cache-Control', 'private, max-age=0');
  } else {
    // Allow modest caching with revalidation for any future static HTML served via this server
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  }
  next();
});

// Rate limiter: limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Initialize Firebase Admin for verifying ID tokens
if (!admin.apps.length) {
  // Ensure a databaseURL is provided; fall back to the client firebase config
  // value if the environment variable is missing. This is safe because the
  // client config is public info (API key + database URL) and allows the
  // Admin SDK to operate locally without requiring the env var during dev.
  const fallbackDbUrl = 'https://web-wiseglobalresearch-default-rtdb.firebaseio.com/';
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL || fallbackDbUrl,
  });
}

// Middleware to require a valid Firebase ID token; restrict to admin users
const requireAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, error: { message: 'Missing bearer token' } });
    const decoded = await admin.auth().verifyIdToken(token);
    let isAdmin = decoded.admin === true;
    if (!isAdmin) {
      try {
        const snap = await admin.database().ref(`admins/${decoded.uid}`).get();
        isAdmin = snap.exists() && snap.val() === true;
      } catch (_) {
        isAdmin = false;
      }
    }
    if (!isAdmin) return res.status(403).json({ success: false, error: { message: 'Admin only' } });
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, error: { message: 'Invalid token' } });
  }
};

// Robust send helper: attempts to send mail and retries on transient network errors
async function sendMailWithRetry(transporter, mailOptions, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      console.debug(`Attempt ${attempt} to send mail to ${mailOptions.to || mailOptions.to}`);
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      const code = err && err.code ? err.code : null;
      const msg = err && err.message ? err.message : String(err);
      const isTransient = code === 'ETIMEDOUT' || code === 'ECONNRESET' || code === 'EPIPE' || code === 'ECONNREFUSED' || /timeout/i.test(msg);
      console.warn(`sendMail attempt ${attempt} failed (code=${code}): ${msg}`);
      if (attempt === attempts || !isTransient) {
        // No more retries or non-transient error - consider SES API fallback when available and configured
        // Only attempt SES fallback when this is a transient network failure and AWS creds are present
        const canAttemptSes = isTransient && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && SESClient && SendEmailCommand;
        if (canAttemptSes) {
          try {
            console.warn('Attempting SES API fallback after SMTP failure');
            const sesResult = await sendViaSesFallback(mailOptions);
            return sesResult;
          } catch (sesErr) {
            console.error('SES fallback failed:', sesErr && sesErr.message ? sesErr.message : sesErr);
            // If SES fallback fails, rethrow original SMTP error to preserve context
            throw err;
          }
        }
        // No SES fallback available - rethrow
        throw err;
      }
      // Exponential backoff with cap
      const backoff = Math.min(30000, 1000 * Math.pow(2, attempt - 1));
      console.debug(`Retrying sendMail after ${backoff}ms (attempt ${attempt + 1} of ${attempts})`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
}

// SES API fallback: constructs a SendEmailCommand input and sends via AWS SES API
async function sendViaSesFallback(mailOptions) {
  if (!SESClient || !SendEmailCommand) throw new Error('SES client not available');
  // Build destinations: ToAddresses, CcAddresses, BccAddresses (we only use To here)
  const toAddrs = (mailOptions.to || '').split(',').map(s => s.trim()).filter(Boolean);
  const fromAddr = mailOptions.from || process.env.EMAIL_FROM || (process.env.AWS_SES_DEFAULT_FROM || null);
  if (!fromAddr) throw new Error('SES fallback requires a from address (EMAIL_FROM or AWS_SES_DEFAULT_FROM)');

  const sesClient = new SESClient({ region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-south-1' });

  const params = {
    Destination: {
      ToAddresses: toAddrs,
    },
    Message: {
      Body: {
        Html: { Data: mailOptions.html || mailOptions.text || '' },
        Text: { Data: mailOptions.text || mailOptions.html || '' },
      },
      Subject: { Data: mailOptions.subject || 'Website submission' },
    },
    Source: fromAddr,
  };

  const cmd = new SendEmailCommand(params);
  const resp = await sesClient.send(cmd);
  // Normalize a minimal response shape similar to nodemailer send info
  return { messageId: resp.MessageId || null, sesResponse: resp };
}

// SES raw send: supports attachments by constructing a raw MIME message via nodemailer's MailComposer
async function sendViaSesRaw(mailOptions) {
  if (!SESClient || !SendRawEmailCommand) throw new Error('SES Raw client not available');
  // Use nodemailer's MailComposer to build a raw MIME message
  const MailComposer = require('nodemailer/lib/mail-composer');
  const fromAddr = mailOptions.from || process.env.EMAIL_FROM || process.env.AWS_SES_DEFAULT_FROM || null;
  if (!fromAddr) throw new Error('SES raw send requires a from address');

  const composer = new MailComposer({
    from: fromAddr,
    to: mailOptions.to,
    cc: mailOptions.cc,
    bcc: mailOptions.bcc,
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html,
    attachments: mailOptions.attachments || [],
  });

  const messageBuffer = await composer.compile().build();

  const sesClient = new SESClient({ region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-south-1' });
  const params = {
    RawMessage: { Data: messageBuffer
    },
    Source: fromAddr,
    Destinations: (mailOptions.to || '').split(',').map(s => s.trim()).filter(Boolean),
  };

  const cmd = new SendRawEmailCommand(params);
  const resp = await sesClient.send(cmd);
  return { messageId: resp.MessageId || null, sesResponse: resp };
}

// Digio API Configuration
const DIGIO_API_URL = process.env.DIGIO_API_URL;
const DIGIO_API_KEY = process.env.DIGIO_API_KEY;

// Schema for client form payload
const clientFormSchema = z.object({
  clientName: z.string().min(1),
  address: z.string().min(1),
  dob: z.string().min(1),
  pan: z.string().min(1),
  email: z.string().email(),
  clientId: z.string().optional(),
});

// API Route (admin-only)
app.post('/api/submit-client-form', async (req, res) => {
  try {
    const parse = clientFormSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: { message: 'Invalid payload', issues: parse.error.flatten() } });
    }
    const formData = parse.data;

    // Prepare payload for Digio API
    const postData = {
      signers: [
        {
          identifier: formData.email,
          name: formData.clientName,
          sign_type: "aadhaar"
        }
      ],
      expire_in_days: 10,
      send_sign_link: true,
      notify_signers: true,
      will_self_sign: false,
      display_on_page: "custom",
      file_name: `${formData.clientName}.pdf`,
      templates: [
        {
            template_key: "TMP2512310008138647FYW92R7JMI1XW",
          template_values: {
            "client full name": formData.clientName,
            "clientId": formData.clientId || "NA",
            "address": formData.address,
            "dob": formData.dob,
            "pan": formData.pan,
            "email": formData.email
          }
        }
      ]
    };

    // Make request to Digio API
    const response = await axios.post(DIGIO_API_URL, postData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': DIGIO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    // Send success response
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    // Improved error logging for all cases
    let logMsg = '[API Error] ';
    if (error) {
      if (error.response && error.response.data) {
        logMsg += 'Response data: ' + JSON.stringify(error.response.data);
      } else if (error.message) {
        logMsg += 'Message: ' + error.message;
      } else {
        logMsg += JSON.stringify(error);
      }
      if (error.stack) {
        logMsg += '\nStack: ' + error.stack;
      }
    } else {
      logMsg += 'Unknown error (error object is falsy)';
    }
    console.error(logMsg);
    // Send error response
    res.status((error && error.response && error.response.status) || 500).json({
      success: false,
      error: (error && error.response && error.response.data) || { message: 'Server error' }
    });
  }
});

// Simple health check
app.get('/health', (req, res) => {
  // Explicit content-type / charset for consistency with audit expectations
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json({ status: 'ok' });
});

// Optional IndexNow ping helper
// POST { sitemap: 'https://wiseglobalresearch.com/sitemap.xml', key: '<optional-key>' }
app.post('/api/indexnow-ping', async (req, res) => {
  try {
    const sitemap = req.body && req.body.sitemap;
    if (!sitemap) return res.status(400).json({ success: false, error: { message: 'Missing sitemap' } });
    // IndexNow endpoints to ping (common providers). The client may include a key param; otherwise server will attempt without it.
    const endpoints = [
      'https://www.bing.com/indexnow',
      'https://www.microsoft.com/indexnow'
    ];
    const key = req.body.key || process.env.INDEXNOW_KEY || '';
    const payload = { url: sitemap, key: key };
    const results = [];
    for (const ep of endpoints) {
      try {
        const r = await axios.get(ep, { params: payload, timeout: 5000 });
        results.push({ endpoint: ep, status: r.status });
      } catch (e) {
        results.push({ endpoint: ep, error: e.message });
      }
    }
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------
// Email sending endpoint
// ----------------------------
// Uses SMTP credentials provided via environment variables.
// Required env vars: SMTP_SERVER, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, EMAIL_TO
const emailSchema = z.object({
  name: z.string().min(1),
  mobile: z.string().optional(),
  city: z.string().optional(),
  interest: z.string().optional(),
  email: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  // Optional fields used by specific forms
  to: z.string().optional(), // comma-separated recipients
  subject: z.string().optional(),
  pageUrl: z.string().optional(),
  type: z.string().optional(),
  severity: z.string().optional(),
  device: z.string().optional(),
  assistiveTech: z.string().optional(),
});

// Accept both JSON and multipart/form-data (with optional file named 'resume')
app.post('/send-email', upload.single('resume'), async (req, res) => {
  try {
    // Debug: log whether a file was received (helpful for diagnosing missing attachments)
    try {
      if (req.file) {
        console.debug('/send-email: received file', { originalname: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype });
      } else {
        console.debug('/send-email: no file received in multipart request');
      }
    } catch (dbgErr) {
      console.debug('/send-email: error while logging file info', dbgErr && dbgErr.message ? dbgErr.message : dbgErr);
    }
    // If multipart, fields are in req.body and file in req.file
    const incoming = Object.keys(req.body).length ? req.body : req.body || {};
    // Validate fields using zod by constructing an object similar to expected shape
    const parse = emailSchema.safeParse(incoming);
    if (!parse.success) {
      console.warn('Invalid /send-email payload:', parse.error.format());
      return res.status(400).json({ success: false, error: { message: 'Invalid payload', issues: parse.error.flatten() } });
    }
    const {
      name,
      mobile = '',
      city = '',
      interest = '',
      email: userEmail = '',
      message = '',
      source = '',
      to: toField = '',
      subject: subjectField = '',
      pageUrl = '',
      type: formType = '',
      severity: formSeverity = '',
      device: formDevice = '',
      assistiveTech: formAssistive = ''
    } = parse.data;

    // If multipart upload didn't provide a file, accept a base64 resume in JSON body as fallback
    if (!req.file && req.body && req.body.resumeBase64) {
      try {
        const b64 = String(req.body.resumeBase64 || '').trim();
        const name = String(req.body.resumeName || 'resume').trim();
        const type = String(req.body.resumeType || 'application/pdf').trim();
        if (b64) {
          const buf = Buffer.from(b64, 'base64');
          req.file = { originalname: name, mimetype: type, buffer: buf, size: buf.length };
          console.debug('/send-email: constructed req.file from resumeBase64 fallback', { originalname: name, size: buf.length, mimetype: type });
        }
      } catch (e) {
        console.debug('/send-email: error parsing resumeBase64 fallback', e && e.message ? e.message : e);
      }
    }

    // Create a sending strategy: prefer AWS SES API/Raw when credentials and client are available.
    let usedEthereal = false;
    const hasAwsCreds = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && SESClient && (SendRawEmailCommand || SendEmailCommand);
    // If AWS creds present, we'll use SES API/Raw in background. Otherwise fall back to Ethereal in non-prod or error in prod.
    if (!hasAwsCreds && process.env.NODE_ENV === 'production') {
      return res.status(500).json({ success: false, error: { message: 'Email sending is not configured on this server' } });
    }

    const from = process.env.EMAIL_FROM || smtpUser || 'no-reply@example.com';
    const infoEmail = process.env.INFO_EMAIL_TO || process.env.EMAIL_TO || 'hemraj8087@gmail.com';
    const supportEmail = process.env.SUPPORT_EMAIL_TO || 'support@wiseglobalresearch.com';
    const careerEmail = process.env.CAREER_EMAIL || 'career@wiseglobalresearch.com';

    // Build recipients depending on source/interest.
    let recipients = [];
    const isCareerSubmission = String(source).toLowerCase() === 'career' || String(interest).toLowerCase().includes('career');

    if (toField && String(toField).trim()) {
      // Allow client to request specific recipients (comma-separated). Server will still dedupe and validate.
      recipients = recipients.concat(String(toField).split(',').map(s => s.trim()).filter(Boolean));
    }

    if (isCareerSubmission) {
      // For career submissions, send only to the career mailbox
      recipients.push(careerEmail);
    } else if (source === 'Complaints') {
      // For complaints, send to support
      recipients.push(supportEmail);
    } else {
      // For all other submissions, send to the general info mailbox
      recipients.push(infoEmail);
      // Historically we sent a copy to the central mailbox; avoid sending to the
      // central address for Leedsfrom submissions (source === 'LeedsfromPage')
      // to respect the requirement that Leedsfrom data should NOT go to that inbox.
      if (String(source).toLowerCase() !== 'leedsfrompage') {
        recipients.push('wiseglobalresearchservice@gmail.com');
      }
    }

    if (source === 'ContactPage') {
      recipients.push('hemraj@wiseglobalresearch.com');
    }
    // Deduplicate
    recipients = Array.from(new Set(recipients.filter(Boolean)));
    const to = recipients.join(',');

    console.debug('Sending notification email to:', to);

    const subject = subjectField || `New website submission: ${interest || 'Interest'}${source ? ` (${source})` : ''}`;
    const textParts = [
      `You have a new submission from the website:`,
      `Name: ${name}`,
      `Email: ${userEmail || ''}`,
      `Mobile: ${mobile}`,
      `City: ${city}`,
      `Interest: ${interest}`,
    ];
    if (formType) textParts.push(`Type: ${formType}`);
    if (formSeverity) textParts.push(`Severity: ${formSeverity}`);
    if (formDevice) textParts.push(`Device: ${formDevice}`);
    if (formAssistive) textParts.push(`Assistive Tech: ${formAssistive}`);
    if (pageUrl) textParts.push(`Page URL: ${pageUrl}`);
    if (message) textParts.push(`Message: ${message}`);
    if (source) textParts.push(`Source: ${source}`);
    textParts.push('\n-- End of message');
    const text = textParts.join('\n');

    const html = `
      <p>You have a new submission from the website:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${userEmail || ''}</li>
        <li><strong>Mobile:</strong> ${mobile}</li>
        <li><strong>City:</strong> ${city}</li>
        <li><strong>Interest:</strong> ${interest}</li>
        ${formType ? `<li><strong>Type:</strong> ${formType}</li>` : ''}
        ${formSeverity ? `<li><strong>Severity:</strong> ${formSeverity}</li>` : ''}
        ${formDevice ? `<li><strong>Device:</strong> ${formDevice}</li>` : ''}
        ${formAssistive ? `<li><strong>Assistive Tech:</strong> ${formAssistive}</li>` : ''}
        ${pageUrl ? `<li><strong>Page URL:</strong> ${pageUrl}</li>` : ''}
        ${message ? `<li><strong>Message:</strong> ${String(message)}</li>` : ''}
        ${source ? `<li><strong>Source:</strong> ${source}</li>` : ''}
      </ul>
    `;

    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
    };

    // If a resume file was included in multipart, attach it
    if (req.file && req.file.buffer) {
      mailOptions.attachments = [
        {
          filename: req.file.originalname || 'resume',
          content: req.file.buffer,
          contentType: req.file.mimetype || 'application/octet-stream',
        },
      ];
    }

    // Make email sending asynchronous to avoid blocking the HTTP response.
    // Respond 202 Accepted immediately and perform send in background.
    (async function doSendInBackground() {
      try {
        // Prefer AWS SES Raw (supports attachments) when AWS creds and client are available.
        const hasAwsCredsLocal = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && SESClient && SendRawEmailCommand;
        try {
          if (hasAwsCredsLocal) {
            console.debug('AWS creds detected; sending email via SES Raw API');
            const info = await sendViaSesRaw(mailOptions);
            console.debug('SES Raw API send succeeded (background):', info && info.messageId ? info.messageId : info);
            return;
          }
        } catch (sesErr) {
          console.error('SES Raw send failed, attempting SES SendEmail fallback if available:', sesErr && sesErr.message ? sesErr.message : sesErr);
          // Try non-raw SES if attachments are not present and SendEmailCommand is available
          if (!(mailOptions.attachments && mailOptions.attachments.length) && SESClient && SendEmailCommand) {
            try {
              const info = await sendViaSesFallback(mailOptions);
              console.debug('SES SendEmail API send succeeded (background):', info && info.messageId ? info.messageId : info);
              return;
            } catch (sesErr2) {
              console.error('SES SendEmail fallback also failed:', sesErr2 && sesErr2.message ? sesErr2.message : sesErr2);
            }
          }
        }

        // If we reach here and we're in development, use Ethereal
        if (process.env.NODE_ENV !== 'production') {
          try {
            console.debug('Using Ethereal transporter for local email preview');
            const testAccount = await nodemailer.createTestAccount();
            const transporterLocal = nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, secure: false, auth: { user: testAccount.user, pass: testAccount.pass } });
            const info = await transporterLocal.sendMail(mailOptions);
            console.debug('Ethereal email sent (background):', { messageId: info.messageId });
            console.debug('Ethereal preview URL (background):', nodemailer.getTestMessageUrl(info) || null);
            return;
          } catch (ethErr) {
            console.error('Ethereal fallback failed:', ethErr && ethErr.message ? ethErr.message : ethErr);
          }
        }

        // If we still haven't sent the email, log and throw so it's visible in logs
        throw new Error('No available email sending method succeeded');
      } catch (error) {
        try {
          const code = error && error.code ? error.code : null;
          const message = error && error.message ? error.message : String(error);
          const shortStack = error && error.stack ? error.stack.split('\n').slice(0, 6).join('\n') : null;
          console.error('Background email send error:', { code, message, shortStack });
        } catch (inner) {
          console.error('Error while logging background email error:', inner && inner.stack ? inner.stack : inner);
        }
      }
    })().catch((e) => console.error('doSendInBackground unexpected error:', e));

    // Respond immediately so frontend is not blocked waiting for email delivery
    return res.status(202).json({ success: true, accepted: true, message: 'Email send queued' });
  } catch (error) {
    // Better diagnostics: log code + short stack (first lines) to server logs, return structured error JSON
    try {
      const code = error && error.code ? error.code : null;
      const message = error && error.message ? error.message : String(error);
      const shortStack = error && error.stack ? error.stack.split('\n').slice(0, 6).join('\n') : null;
      console.error('Email send error:', { code, message, shortStack });
      // Include any provider response body if present (non-sensitive)
      const providerInfo = error && error.response ? (error.response.data || error.response) : undefined;
      const resp = { success: false, error: { message, code } };
      if (providerInfo) resp.error.provider = providerInfo;
      res.status(500).json(resp);
    } catch (inner) {
      console.error('Error while handling email send error:', inner && inner.stack ? inner.stack : inner);
      res.status(500).json({ success: false, error: { message: 'Email send failed' } });
    }
  }
});

// ---------------------------------------------------------------------------
// Debug-only email endpoint (Ethereal) - enabled only when DEBUG_EMAIL_TOKEN is set
// POST /send-email-debug
// Header: x-debug-token: <token>
// Body: same as /send-email (JSON). Returns previewUrl so developer can view the email.
app.post('/send-email-debug', async (req, res) => {
  try {
    // Only enable when a debug token is configured in env
    const debugToken = process.env.DEBUG_EMAIL_TOKEN;
    if (!debugToken) return res.status(404).json({ success: false, error: { message: 'Debug endpoint disabled' } });

    const provided = req.header('x-debug-token');
    if (!provided || provided !== debugToken) return res.status(403).json({ success: false, error: { message: 'Invalid debug token' } });

    // Accept JSON body similar to /send-email
    const incoming = Object.keys(req.body).length ? req.body : req.body || {};
    const parse = emailSchema.safeParse(incoming);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: { message: 'Invalid payload', issues: parse.error.flatten() } });
    }

    const { name, mobile = '', city = '', interest = '', email: userEmail = '', message = '', source = '' } = parse.data;

    // Create Ethereal test account and transporter
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const from = process.env.EMAIL_FROM || testAccount.user;
    const to = process.env.INFO_EMAIL_TO || process.env.EMAIL_TO || testAccount.user;
    const subject = `Debug: New website submission: ${interest || 'Interest'}`;
    const textParts = [
      `You have a new submission (debug):`,
      `Name: ${name}`,
      `Email: ${userEmail || ''}`,
      `Mobile: ${mobile}`,
      `City: ${city}`,
      `Interest: ${interest}`,
    ];
    if (message) textParts.push(`Message: ${message}`);
    if (source) textParts.push(`Source: ${source}`);

    const html = `
      <p>Debug submission:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${userEmail || ''}</li>
        <li><strong>Mobile:</strong> ${mobile}</li>
        <li><strong>City:</strong> ${city}</li>
        <li><strong>Interest:</strong> ${interest}</li>
      </ul>
    `;

  const info = await sendMailWithRetry(transporter, { from, to, subject, text: textParts.join('\n'), html }, parseInt(process.env.SMTP_SEND_RETRIES || '3', 10));

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;
    console.debug('/send-email-debug previewUrl:', previewUrl);
    res.json({ success: true, messageId: info.messageId, previewUrl });
  } catch (err) {
    console.error('/send-email-debug error:', err);
    const message = err && err.message ? err.message : String(err);
    res.status(500).json({ success: false, error: { message } });
  }
});

// Debug endpoint to test raw TCP connectivity to the configured SMTP server.
// Protected by DEBUG_EMAIL_TOKEN env var. Call as:
// GET /smtp-check?token=xxxx
app.get('/smtp-check', async (req, res) => {
  const debugToken = process.env.DEBUG_EMAIL_TOKEN;
  const provided = req.query && req.query.token ? String(req.query.token) : null;
  if (!debugToken || !provided || provided !== debugToken) {
    return res.status(404).json({ success: false, error: { message: 'Debug endpoint disabled or invalid token' } });
  }

  const net = require('net');
  const host = process.env.SMTP_SERVER || 'smtp.example.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const timeoutMs = parseInt(process.env.SMTP_CHECK_TIMEOUT || '10000', 10);

  let done = false;
  const socket = net.createConnection({ host, port }, () => {
    if (done) return;
    done = true;
    socket.end();
    return res.json({ success: true, host, port, message: 'Connected' });
  });

  socket.setTimeout(timeoutMs, () => {
    if (done) return;
    done = true;
    socket.destroy();
    return res.status(504).json({ success: false, error: { message: 'Connection timeout' , code: 'ETIMEDOUT' } });
  });

  socket.on('error', (err) => {
    if (done) return;
    done = true;
    try { socket.destroy(); } catch (_) {}
    return res.status(502).json({ success: false, error: { message: err.message || String(err), code: err.code || 'ERR' } });
  });
});

// Basic economic events endpoint (mock data or pass-through when url is provided and whitelisted server-side)
app.get('/api/economic', async (req, res) => {
  try {
    const { url } = req.query;
    // If you later add whitelist + fetch real data, do it here. For now return mock events.
    // Simple in-memory cache to speed up repeated requests (TTL 10s)
    const cacheKey = 'economic:default';
    if (!app.locals.economicCache) app.locals.economicCache = new Map();
    const cached = app.locals.economicCache.get(cacheKey);
    if (cached && (Date.now() - cached.ts) < 10 * 1000) {
      return res.json(cached.value);
    }
    const now = Date.now();
    const countries = ['IN', 'US', 'EU', 'GB', 'JP'];
    const titles = ['CPI (YoY)', 'GDP Growth Rate', 'Retail Sales MoM', 'Unemployment Rate', 'Trade Balance'];
    const out = Array.from({ length: 10 }).map((_, i) => {
      const t = new Date(now + (i + 1) * (30 + Math.floor(Math.random() * 90)) * 60000);
      const prev = (Math.random() * 5).toFixed(1) + '%';
      const consensus = (parseFloat(prev) + (Math.random() * 2 - 1)).toFixed(1) + '%';
      const actual = (parseFloat(consensus) + (Math.random() * 2 - 1)).toFixed(1) + '%';
      return {
        id: `srv-${now}-${i}`,
        date: t.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        time: t.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        isoTime: t.toISOString(),
        country: countries[i % countries.length],
        title: titles[i % titles.length],
        impact: Math.ceil(Math.random() * 3),
        previous: prev,
        consensus,
        actual,
      };
    });
    // Store in cache
    app.locals.economicCache.set(cacheKey, { ts: Date.now(), value: out });
    res.json(out);
  } catch (e) {
    res.status(500).json({ error: 'failed to load economic data' });
  }
});

// Start server with explicit error handling so EADDRINUSE and other errors
// are handled gracefully and produce helpful diagnostics instead of crashing.
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. If you intended to run another process on this port, stop it or set PORT to a different value.`);
    process.exit(1);
  }
  console.error('Server error:', err && err.stack ? err.stack : err);
  process.exit(1);
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.debug(`Listening on ${bind}`);
});

// Error handler for file upload size limits and other multer errors
app.use((err, req, res, next) => {
  try {
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      console.warn('Upload rejected: file too large', err);
      return res.status(413).json({ success: false, error: { message: 'Uploaded file too large. Maximum allowed size is 20MB.' } });
    }
    // Pass through other errors
  } catch (e) {
    // ignore
  }
  next(err);
});

// Endpoint to accept popup form submissions from the client and persist
// them server-side using the Admin SDK. This avoids client-side permission
// issues when RTDB rules restrict unauthenticated or anonymous writes.
const popupSchema = z.object({
  name: z.string().optional(),
  mobile: z.string().optional(),
  city: z.string().optional(),
  interest: z.string().optional(),
  honeypot: z.string().optional(),
  timestamp: z.number().optional(),
});

app.post('/submit-popup', async (req, res) => {
  try {
    const parse = popupSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: { message: 'Invalid payload', issues: parse.error.flatten() } });
    }
    const data = parse.data;

    // Basic bot protection: reject if honeypot filled
    if (data.honeypot && String(data.honeypot).trim().length > 0) {
      return res.status(400).json({ success: false, error: { message: 'Bot detected' } });
    }

    // Ensure timestamp
    const payload = Object.assign({ timestamp: Date.now() }, data);

    // Use Admin SDK to write to RTDB (bypasses client rules)
    const refPath = 'popupFormSubmissions';
    const pushRef = await admin.database().ref(refPath).push(payload);

    // Send notification email for popup submission (also send to career mailbox)
    try {
      // Prefer SES Raw API when AWS creds present; otherwise use Ethereal in dev for preview
      try {
        const from = process.env.EMAIL_FROM || process.env.AWS_SES_DEFAULT_FROM || 'no-reply@example.com';
        const infoEmail = process.env.INFO_EMAIL_TO || process.env.EMAIL_TO || 'info@wiseglobalresearch.com';
        const supportEmail = process.env.SUPPORT_EMAIL_TO || 'support@wiseglobalresearch.com';
        const careerEmail = process.env.CAREER_EMAIL || 'career@wiseglobalresearch.com';
        const recipients = [careerEmail, infoEmail, supportEmail, 'wiseglobalresearchservice@gmail.com'].filter(Boolean).join(',');

        const subject = `New popup submission: ${payload.interest || 'Interest'}`;
        const textParts = [
          'New popup submission received:',
          `Name: ${payload.name || ''}`,
          `Mobile: ${payload.mobile || ''}`,
          `City: ${payload.city || ''}`,
          `Interest: ${payload.interest || ''}`,
          `Timestamp: ${new Date(payload.timestamp).toISOString()}`,
          `RTDB Key: ${pushRef.key}`,
        ];

        const html = `
          <p>A new popup submission was received and persisted (key: <strong>${pushRef.key}</strong>):</p>
          <ul>
            <li><strong>Name:</strong> ${payload.name || ''}</li>
            <li><strong>Mobile:</strong> ${payload.mobile || ''}</li>
            <li><strong>City:</strong> ${payload.city || ''}</li>
            <li><strong>Interest:</strong> ${payload.interest || ''}</li>
            <li><strong>Timestamp:</strong> ${new Date(payload.timestamp).toISOString()}</li>
          </ul>
        `;

        const mailOptions = { from, to: recipients, subject, text: textParts.join('\n'), html };
        const hasAwsCredsLocal = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && SESClient && SendRawEmailCommand;
        if (hasAwsCredsLocal) {
          const info = await sendViaSesRaw(mailOptions);
          console.debug('/submit-popup email sent via SES Raw', { messageId: info.messageId });
          return res.json({ success: true, key: pushRef.key, messageId: info.messageId });
        }

        if (process.env.NODE_ENV !== 'production') {
          const testAccount = await nodemailer.createTestAccount();
          const transporterLocal = nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, secure: false, auth: { user: testAccount.user, pass: testAccount.pass } });
          const info = await transporterLocal.sendMail(mailOptions);
          console.debug('/submit-popup Ethereal preview URL:', nodemailer.getTestMessageUrl(info) || null);
          return res.json({ success: true, key: pushRef.key, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) || null });
        }
      } catch (mailErr) {
        console.error('/submit-popup email error:', mailErr);
        return res.json({ success: true, key: pushRef.key, warning: 'email_failed', details: mailErr.message || String(mailErr) });
      }

    } catch (mailErr) {
      console.error('/submit-popup email error:', mailErr);
      // Fall through to return success for DB write but include warning
      return res.json({ success: true, key: pushRef.key, warning: 'email_failed', details: mailErr.message || String(mailErr) });
    }

    // If email wasn't attempted (no transporter) still return DB success
    return res.json({ success: true, key: pushRef.key });
  } catch (error) {
    console.error('/submit-popup error:', error);
    res.status(500).json({ success: false, error: { message: error.message || String(error) } });
  }
});

