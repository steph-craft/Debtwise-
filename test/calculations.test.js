import test from "node:test";
import assert from "node:assert/strict";
import { calcSummary, formatMoney } from "../js/calculations.js";

test("formatMoney", () => assert.equal(formatMoney(1234.5), "$1,234.50"));
test("empty list", () => assert.deepEqual(calcSummary([]), { totalBalance: 0, totalMin: 0, paidPct: 0 }));
test("summary totals and percent", () => {
  const s = calcSummary([
    { balance: 50, originalAmount: 100, minPayment: 10 },
    { balance: 0, originalAmount: 100, minPayment: 20 },
  ]);
  assert.deepEqual(s, { totalBalance: 50, totalMin: 10, paidPct: 75 });
});

test("formatMoney converts currency", () => assert.equal(formatMoney(1000, "EUR", 0.9), "€900.00"));
test("formatMoney falls back on bad code", () => assert.equal(formatMoney(10, "??", 2), "?? 20.00"));
