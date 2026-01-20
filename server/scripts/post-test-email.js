// Simple test client for /send-email
// Usage: node scripts/post-test-email.js

(async () => {
  try {
    const res = await fetch('http://localhost:3001/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'CI Test', email: 'ci-test@example.com', message: 'Test message from CI', source: 'automated-test' })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
    process.exit(0);
  } catch (err) {
    console.error('Request failed:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();
