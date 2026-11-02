const host = globalThis.location?.hostname;
export const BASE_URL = host === "localhost" || host === "127.0.0.1"
  ? "http://localhost:3000"
  : "https://YOUR-API-NAME.onrender.com"; // replace after deploying the API

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}
const body = (method, data) => ({ method, body: JSON.stringify(data) });

export const getDebts = () => request("/debts");                       // GET
export const createDebt = (d) => request("/debts", body("POST", d));   // POST
export const replaceDebt = (id, d) => request(`/debts/${id}`, body("PUT", d));     // PUT
export const patchDebt = (id, c) => request(`/debts/${id}`, body("PATCH", c));     // PATCH
export const deleteDebt = (id) => request(`/debts/${id}`, { method: "DELETE" });   // DELETE

export const RATES_URL = "https://open.er-api.com/v6/latest/USD";

export async function getRates() {                                     // GET (external API)
  const res = await fetch(RATES_URL);
  if (!res.ok) throw new Error(`Rates request failed (${res.status})`);
  const data = await res.json();
  if (data.result !== "success") throw new Error("Rates unavailable");
  return data.rates;
}
