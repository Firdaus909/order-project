export const generateOrderId = () => {
  const prefixes = ['AOi', 'AOb', 'AOs', 'DOk', 'MOk', 'MOab', 'AOi1', 'AOi2'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, '');
  const randomNumber = Math.floor(10000 + Math.random() * 90000);

  return randomPrefix + datePart + randomNumber;
};
