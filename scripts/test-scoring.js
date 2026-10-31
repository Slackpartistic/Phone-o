// Run: node scripts/test-scoring.js
// Checks the phone list is valid and that sample shoppers get sensible, repeatable results.
const { recommend } = require("../docs/scoring.js");
const data = require("../docs/phones.json");
const assert = require("assert");

for (const p of data.phones) {
  for (const k of ["camera", "battery", "performance", "display", "durability"]) {
    const v = p.ratings[k];
    assert(Number.isFinite(v) && v >= 0 && v <= 10, `${p.name}: ${k} rating must be 0-10`);
  }
  assert(p.regions.AU && Number.isFinite(p.regions.AU.price), `${p.name}: needs an AU price`);
  assert(["ios", "android"].includes(p.os), `${p.name}: os must be ios or android`);
}
const ids = data.phones.map(p => p.id);
assert.strictEqual(new Set(ids).size, ids.length, "phone ids must be unique");

const base = { platform: "either", camera: 1, battery: 1, performance: 1, display: 1, durability: 1, size: "any", keepYears: 4, refurbishedOk: false };
const cases = {
  "Parent, photos, under $1,000": { ...base, budget: 1000, camera: 3, battery: 2, size: "regular" },
  "Student, under $300, refurbished OK": { ...base, budget: 300, battery: 3, keepYears: 2, refurbishedOk: true },
  "iPhone fan, small, 6 years": { ...base, budget: null, platform: "ios", size: "small", keepYears: 6 },
  "Android gamer, under $1,500": { ...base, budget: 1500, platform: "android", performance: 3, display: 3, size: "large" },
};
for (const [name, a] of Object.entries(cases)) {
  const r1 = recommend(data.phones, a), r2 = recommend(data.phones, a);
  assert.deepStrictEqual(r1.map(x => x.p.id), r2.map(x => x.p.id), `${name}: results must be repeatable`);
  assert(r1.length > 0, `${name}: should find at least one phone`);
  for (const x of r1) {
    if (a.budget) assert(x.r.price <= a.budget, `${name}: ${x.p.name} is over budget`);
    if (a.platform !== "either") assert.strictEqual(x.p.os, a.platform);
  }
  console.log(`${name}: ${r1.map(x => `${x.p.name} ($${x.r.price})`).join(", ")}`);
}
console.log(`\nAll checks passed for ${data.phones.length} phones.`);
