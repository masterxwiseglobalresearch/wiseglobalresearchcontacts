export const marketSymbols = [
  { name: 'Nifty 50', symbol: 'NSE:NIFTY' },
  { name: 'Sensex', symbol: 'BSE:SENSEX' },
  { name: 'Bank Nifty', symbol: 'NSE:BANKNIFTY' },
  { name: 'Midcap Nifty', symbol: 'NSE:MIDCAPNIFTY' },
  { name: 'Nifty IT', symbol: 'NSE:NIFTYIT' },
  { name: 'Nifty Pharma', symbol: 'NSE:NIFTYPHARMA' },
];

export const generateChartData = (symbol) => {  
  const baseValues = {
    'NSE:NIFTY': [22000, 22500, 22300, 22800, 23000, 23500, 24000],
    'BSE:SENSEX': [72000, 73000, 72500, 73500, 74000, 74500, 75000],
    'NSE:BANKNIFTY': [46000, 46500, 47000, 47500, 48000, 48500, 49000],
    'NSE:MIDCAPNIFTY': [9800, 9900, 9950, 10000, 10100, 10200, 10300],
    'NSE:NIFTYIT': [35000, 35500, 36000, 36500, 37000, 37500, 38000],
    'NSE:NIFTYPHARMA': [12500, 12600, 12750, 12800, 12900, 13000, 13100],
  };

  const colors = {
    'NSE:NIFTY': { border: '#A1C4FD', bg: 'rgba(161, 196, 253, 0.2)' },
    'BSE:SENSEX': { border: '#D4A1FD', bg: 'rgba(212, 161, 253, 0.2)' },
    'NSE:BANKNIFTY': { border: '#FFD700', bg: 'rgba(255, 215, 0, 0.2)' },
    'NSE:MIDCAPNIFTY': { border: '#00CED1', bg: 'rgba(0, 206, 209, 0.2)' },
    'NSE:NIFTYIT': { border: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.2)' },
    'NSE:NIFTYPHARMA': { border: '#4CAF50', bg: 'rgba(76, 175, 80, 0.2)' },
  };

  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    values: baseValues[symbol] || [0, 0, 0, 0, 0, 0, 0],
    ...colors[symbol],
  };
};