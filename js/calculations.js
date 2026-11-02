export function formatMoney(n, currency = "USD", rate = 1) {
  const value = Number(n) * rate;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`; // unknown currency code fallback
  }
}

export function calcSummary(debts) {
  const totalBalance = debts.reduce((s, d) => s + d.balance, 0);
  const totalMin = debts.filter((d) => d.balance > 0).reduce((s, d) => s + d.minPayment, 0);
  const original = debts.reduce((s, d) => s + (d.originalAmount ?? d.balance), 0);
  const paidPct = original > 0 ? Math.round(((original - totalBalance) / original) * 100) : 0;
  return { totalBalance, totalMin, paidPct };
}
