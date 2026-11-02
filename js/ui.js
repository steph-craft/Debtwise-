import { formatMoney } from "./calculations.js";

function el(tag, text, attrs = {}) {
  const n = document.createElement(tag);
  if (text != null) n.textContent = text;
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

export function renderDebts(container, debts, fmt = formatMoney) {
  container.replaceChildren();
  if (!debts.length) return container.append(el("p", "No debts yet. Add one to get started."));
  debts.forEach((d) => {
    const paid = d.balance <= 0;
    const card = el("article", null, { class: `card debt${paid ? " paid" : ""}` });
    card.append(
      el("h3", `${d.name} ${paid ? "(Paid off!)" : ""}`),
      el("p", `${d.creditor} · ${d.interestRate}% APR · Min ${fmt(d.minPayment)} · Due ${d.dueDate}`, { class: "meta" }),
      el("p", `Balance: ${fmt(d.balance)}`)
    );
    const actions = el("div", null, { class: "actions" });
    if (!paid) {
      actions.append(
        el("input", null, { type: "number", min: "0", step: "0.01", placeholder: "Pay (USD)", "aria-label": `Payment for ${d.name}`, "data-pay": d.id }),
        el("button", "Pay", { class: "btn primary", "data-action": "pay", "data-id": d.id })
      );
    }
    actions.append(
      el("button", "Edit", { class: "btn", "data-action": "edit", "data-id": d.id }),
      el("button", "Delete", { class: "btn danger", "data-action": "delete", "data-id": d.id })
    );
    card.append(actions);
    container.append(card);
  });
}

export function renderSummary({ totalBalance, totalMin, paidPct }, fmt = formatMoney) {
  document.getElementById("sum-total").textContent = fmt(totalBalance);
  document.getElementById("sum-min").textContent = fmt(totalMin);
  document.getElementById("sum-pct").textContent = `${paidPct}%`;
  document.getElementById("sum-bar").value = paidPct;
}

export function showStatus(msg, isError = false) {
  const s = document.getElementById("status");
  s.textContent = msg;
  s.className = isError ? "error" : "";
}

export function showErrors(errors) {
  document.querySelectorAll(".err").forEach((n) => (n.textContent = errors[n.dataset.for] || ""));
}

export function fillForm(form, debt) {
  Object.keys(debt).forEach((k) => { if (form.elements[k]) form.elements[k].value = debt[k]; });
  form.elements.name.focus();
}

export function resetForm(form) { form.reset(); form.elements.id.value = ""; showErrors({}); }

export function populateCurrencies(select, codes, selected) {
  select.replaceChildren(...codes.map((c) => el("option", c, { value: c })));
  select.value = selected;
}
