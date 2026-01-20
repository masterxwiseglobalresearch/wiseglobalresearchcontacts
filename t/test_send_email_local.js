const http = require('http');

const payload = JSON.stringify({
  name: 'Unit Test',
  email: 'test@example.com',
  mobile: '0000000000',
  city: 'Testville',
  interest: 'Testing',
  message: 'This is a test from automated script',
  source: 'local-test-script',
  pageUrl: 'http://localhost/test'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/send-email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  },
  timeout: 10000
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', res.headers);
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('BODY:', body);
  });
});

req.on('timeout', () => {
  console.error('Request timed out');
  req.abort();
});

req.on('error', (err) => {
  console.error('Request error:', err && err.message);
});

req.write(payload);
req.end();
