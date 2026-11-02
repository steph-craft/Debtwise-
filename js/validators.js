export function validateDebt(d) {
  const e = {};
  if (!d.name?.trim()) e.name = "Name is required.";
  if (!d.creditor?.trim()) e.creditor = "Creditor is required.";
  if (d.balance === "" || d.balance == null || !(Number(d.balance) > 0)) e.balance = "Enter a balance above 0.";
  const r = Number(d.interestRate);
  if (d.interestRate === "" || d.interestRate == null || isNaN(r) || r < 0 || r > 100) e.interestRate = "Rate must be 0-100.";
  if (d.minPayment === "" || d.minPayment == null || !(Number(d.minPayment) >= 0)) e.minPayment = "Enter a valid minimum payment.";
  if (!d.dueDate) e.dueDate = "Pick a due date.";
  return e;
}

export function validatePayment(amount, balance) {
  const a = Number(amount);
  if (!amount || isNaN(a) || a <= 0) return "Enter a payment above 0.";
  if (a > balance) return "Payment cannot exceed the balance.";
  return null;
}
