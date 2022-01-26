export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 2,
  };

  // Check for trailing zeroes
  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat('en-NZ', options);

  return formatter.format(amount / 100);
}
