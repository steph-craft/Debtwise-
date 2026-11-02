import test from "node:test";
import assert from "node:assert/strict";
import { validateDebt, validatePayment } from "../js/validators.js";

const ok = { name: "Card", creditor: "Bank", balance: "500", interestRate: "18", minPayment: "25", dueDate: "2026-12-01" };
test("valid debt has no errors", () => assert.deepEqual(validateDebt(ok), {}));
test("empty debt reports all fields", () => assert.equal(Object.keys(validateDebt({})).length, 6));
test("rejects bad rate", () => assert.ok(validateDebt({ ...ok, interestRate: "150" }).interestRate));
test("payment: valid", () => assert.equal(validatePayment("50", 100), null));
test("payment: too large", () => assert.ok(validatePayment("500", 100)));
test("payment: empty", () => assert.ok(validatePayment("", 100)));
