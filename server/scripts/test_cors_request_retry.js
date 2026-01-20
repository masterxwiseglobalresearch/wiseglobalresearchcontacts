const fetch = require('node-fetch');
(async () => {
  for (let i=0;i<5;i++){
    try {
      const res = await fetch('http://localhost:3001/send-email', {
        method: 'OPTIONS',
        headers: { Origin: 'http://localhost:3000' },
        timeout: 3000
      });
      console.log('Status:', res.status);
      console.log('Headers:');
      for (const [k,v] of res.headers.entries()) console.log(k+':', v);
      return;
    } catch (e) {
      console.error('Attempt', i+1, 'failed:', e.message || e);
      await new Promise(r=>setTimeout(r, 500));
    }
  }
  console.error('All attempts failed');
})();
