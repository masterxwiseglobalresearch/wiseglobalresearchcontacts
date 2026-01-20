// Simple check: require chatKB and print counts and a few sample entries.
try {
  const kb = require('../src/data/chatKB');
  const merged = kb.MERGED_KB || kb.default || [];
  console.log('MERGED_KB length:', merged.length);
  console.log('Sample entries:');
  merged.slice(0,6).forEach((e,i)=>{
    console.log(i+1, e.id, '-', e.title, '\n   keywords:', (e.keywords||[]).slice(0,6).join(', '));
  });
} catch (e) {
  console.error('Error loading KB:', e.message);
  process.exit(2);
}
