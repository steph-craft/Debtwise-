import * as api from "./api.js";
import { validateDebt, validatePayment } from "./validators.js";
import { calcSummary, formatMoney } from "./calculations.js";
import { renderDebts, renderSummary, showStatus, showErrors, fillForm, resetForm, populateCurrencies } from "./ui.js";

let debts = [];
let rates = { USD: 1 };
let currency = "USD";
try { currency = localStorage.getItem("currency") || "USD"; } catch { /* storage unavailable */ }
const fmt = (n) => formatMoney(n, currency, rates[currency] ?? 1);
const $ = (id) => document.getElementById(id);

function refresh() {
  renderDebts($("debt-list"), debts, fmt);
  renderSummary(calcSummary(debts), fmt);
}

async function load() {
  showStatus("Loading debts…");
  try { debts = await api.getDebts(); refresh(); showStatus(""); }
  catch { showStatus("Could not load debts. Is the API running?", true); }
}

$("debt-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const errors = validateDebt(data);
  showErrors(errors);
  if (Object.keys(errors).length) return;
  const debt = {
    name: data.name.trim(), creditor: data.creditor.trim(), balance: Number(data.balance),
    interestRate: Number(data.interestRate), minPayment: Number(data.minPayment), dueDate: data.dueDate,
  };
  try {
    showStatus("Saving…");
    if (data.id) {
      const old = debts.find((d) => String(d.id) === data.id);
      await api.replaceDebt(data.id, { ...debt, originalAmount: Math.max(old.originalAmount, debt.balance) }); // PUT
    } else {
      await api.createDebt({ ...debt, originalAmount: debt.balance }); // POST
    }
    resetForm(e.target);
    await load();
    showStatus("Saved.");
  } catch { showStatus("Save failed. Please try again.", true); }
});

$("debt-form").addEventListener("reset", () => setTimeout(() => resetForm($("debt-form"))));

$("debt-list").addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.dataset.id;
  const debt = debts.find((d) => String(d.id) === id);
  try {
    if (btn.dataset.action === "edit") fillForm($("debt-form"), debt);
    if (btn.dataset.action === "delete" && confirm(`Delete "${debt.name}"?`)) {
      await api.deleteDebt(id); await load(); showStatus("Deleted.");          // DELETE
    }
    if (btn.dataset.action === "pay") {
      const amount = document.querySelector(`input[data-pay="${id}"]`).value;
      const err = validatePayment(amount, debt.balance);
      if (err) return showStatus(err, true);
      await api.patchDebt(id, { balance: Number((debt.balance - amount).toFixed(2)) }); // PATCH
      await load(); showStatus("Payment recorded.");
    }
  } catch { showStatus("That action failed. Please try again.", true); }
});

async function loadRates() {
  try {
    rates = await api.getRates();
    if (!rates[currency]) currency = "USD";
    populateCurrencies($("currency"), Object.keys(rates), currency);
  } catch { showStatus("Exchange rates unavailable. Showing USD only.", true); }
}

$("currency").addEventListener("change", (e) => {
  currency = e.target.value;
  try { localStorage.setItem("currency", currency); } catch { /* ignore */ }
  refresh();
});

(async () => { await load(); await loadRates(); refresh(); })(); // GET debts, then GET rates
