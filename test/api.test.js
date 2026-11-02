import test from "node:test";
import assert from "node:assert/strict";
import * as api from "../js/api.js";

let calls;
function mockFetch(ok = true) {
  calls = [];
  globalThis.fetch = async (url, opts) => { calls.push({ url, opts }); return { ok, status: ok ? 200 : 500, json: async () => ({}) }; };
}
test("GET", async () => { mockFetch(); await api.getDebts(); assert.ok(calls[0].url.endsWith("/debts")); });
test("POST", async () => { mockFetch(); await api.createDebt({ a: 1 }); assert.equal(calls[0].opts.method, "POST"); });
test("PUT", async () => { mockFetch(); await api.replaceDebt(1, {}); assert.equal(calls[0].opts.method, "PUT"); });
test("PATCH", async () => { mockFetch(); await api.patchDebt(1, {}); assert.equal(calls[0].opts.method, "PATCH"); });
test("DELETE", async () => { mockFetch(); await api.deleteDebt(1); assert.equal(calls[0].opts.method, "DELETE"); });
test("throws on error", async () => { mockFetch(false); await assert.rejects(api.getDebts(), /500/); });

test("getRates returns rates", async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ result: "success", rates: { EUR: 0.9 } }) });
  assert.deepEqual(await api.getRates(), { EUR: 0.9 });
});
test("getRates throws when result is not success", async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ result: "error" }) });
  await assert.rejects(api.getRates(), /unavailable/);
});
