const fetch = require('node-fetch');

const endpoints = [
  'https://wise-globle-research-2.onrender.com/send-email',
  'https://wiseglobalresearch.com/send-email'
];

const payload = {
  name: 'Automated Live Test',
  email: 'test@example.com',
  mobile: '0000000000',
  city: 'Testville',
  interest: 'Live test',
  message: 'This is a live test to /send-email endpoints',
  source: 'live-test-script',
  pageUrl: 'https://wiseglobalresearch.com'
};

(async () => {
  for (const url of endpoints) {
    try {
      console.log('\n--- Posting to', url, '---');
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), timeout: 15000 });
      console.log('STATUS:', res.status, res.statusText);
      let bodyText;
      try {
        const json = await res.json();
        bodyText = JSON.stringify(json);
      } catch (e) {
        bodyText = await res.text();
      }
      console.log('BODY:', bodyText);
    } catch (err) {
      console.error('ERROR:', err && err.message ? err.message : err);
    }
  }
})();
