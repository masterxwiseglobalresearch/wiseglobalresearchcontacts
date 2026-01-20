const fetch = require('node-fetch');

(async () => {
  try {
    const res = await fetch('http://localhost:3001/send-email', {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:3000' }
    });
    console.log('Status:', res.status);
    console.log('Headers:');
    for (const [k,v] of res.headers.entries()) console.log(k+':', v);
  } catch (e) {
    console.error('Error:', e.message || e);
  }
})();
