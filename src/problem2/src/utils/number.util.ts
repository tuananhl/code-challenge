function formatNumber(num: string) {
  const cleaned = num.replace(/[^0-9. ]/g, '');
  const [integerPart, decimalPart] = cleaned.split('.');
  const formattedInteger = integerPart.replace(/\s/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const formatted = decimalPart !== undefined ? `${formattedInteger}.${decimalPart.slice(0, 6)}` : formattedInteger;
  return formatted;
}

export { formatNumber };
