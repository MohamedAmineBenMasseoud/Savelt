// store.js: the only file that touches localStorage and backup files.
import { DEFAULT_GOAL, WEEKLY_SAVINGS, computeWeeks, isValid } from "./calc.js";

const KEY = "savings-budget-v1";
const LEGACY_KEY = "legacy-budget-v1";

export const createEmpty = () => ({ goal: DEFAULT_GOAL, weeks: [] });

/** Check and clean a data object. Throws an Error with a readable message if invalid. */
export function normalize(raw) {
  if (!raw || !Array.isArray(raw.weeks)) throw new Error("Missing weeks list.");
  const weeks = raw.weeks.map((w, i) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(w.startDate || "")) throw new Error(`Week ${i + 1}: invalid date.`);
    const received = Number(w.received);
    if (!Number.isFinite(received) || received < 0) throw new Error(`Week ${i + 1}: invalid amount received.`);
    const saved = Number(w.saved ?? WEEKLY_SAVINGS);
    if (!Number.isFinite(saved) || saved < 0) throw new Error(`Week ${i + 1}: invalid savings amount.`);
    const expenses = (Array.isArray(w.expenses) ? w.expenses : []).map((e) => {
      const amount = Number(e.amount);
      if (!Number.isFinite(amount) || amount <= 0) throw new Error(`Week ${i + 1}: invalid expense amount.`);
      return { name: String(e.name ?? "").trim() || "Expense", amount, category: String(e.category || "Other") };
    });
    return { id: String(w.id || crypto.randomUUID()), startDate: w.startDate, received, saved, expenses };
  });
  const dates = weeks.map((w) => w.startDate);
  if (new Set(dates).size !== dates.length) throw new Error("Two weeks share the same Monday.");
  const goal = Number(raw.goal) > 0 ? Number(raw.goal) : DEFAULT_GOAL;
  const data = { goal, weeks };
  if (!isValid(computeWeeks(weeks))) throw new Error("Some week would end with negative money.");
  return data;
}

/** Load saved data, or an empty budget if nothing valid is stored. */
export function load() {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    return raw ? normalize(JSON.parse(raw)) : createEmpty();
  } catch (e) {
    return createEmpty();
  }
}

/** Save data. Returns true on success, false if the browser refused. */
export function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

/** Remove all saved data. */
export function clear() {
  try { localStorage.removeItem(KEY); } catch (e) {}
}

/** Download the budget as a JSON backup file. */
export function exportData(data) {
  const day = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  a.download = `savings-budget-${day}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Parse backup text into valid data. Throws if the file is not a valid backup. */
export function parseBackup(text) {
  return normalize(JSON.parse(text));
}

/** Read a backup File chosen by the user. Resolves with valid data. */
export function importFile(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      try { resolve(parseBackup(r.result)); } catch (e) { reject(e); }
    };
    r.onerror = () => reject(new Error("Could not read the file."));
    r.readAsText(file);
  });
}