export const parseToCurrency = (value: string) => {
    const replaced = value.replace(/[^0-9.]/g, '')
    const n = parseFloat(replaced)
    if (!isNaN(n) && n > 0) return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    return ""
}
export const parseCurrencyToNumber = (value: string): number | null => {
    const replaced = value.replace(/[^0-9.-]/g, '');
    const n = parseFloat(replaced);
    return !isNaN(n) ? n : null;
};
