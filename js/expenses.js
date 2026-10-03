// expenses.js: add / edit / delete an expense, plus categories.
// Logic only: every function returns { ok, data } or { ok: false, error }.
import { applyChange } from "./calc.js";

export const CATEGORIES = {
  Food: "icons/SaveIt_icons/food.png",
  Water: "icons/SaveIt_icons/water.png",
  Transport: "icons/SaveIt_icons/dashboard.png",
  Entertainment: "icons/SaveIt_icons/entertainment.png",
  Shopping: "icons/SaveIt_icons/shopping.png",
  Study: "icons/SaveIt_icons/study.png",
  "Phone/Internet": "icons/SaveIt_icons/phone.png",
  Coffee: "icons/SaveIt_icons/coffee.png",
  Snacks: "icons/SaveIt_icons/snacks.png",
  Other: "icons/SaveIt_icons/dashboard.png",
};
export const DEFAULT_CATEGORY = "Other";

/** Icon for a category (unknown or custom categories get the "Other" icon). */
export const iconFor = (category) => CATEGORIES[category] || CATEGORIES[DEFAULT_CATEGORY];

const TOO_MUCH = "This expense is higher than the money you have available.";

/** Clean the form values. Returns { expense } or { error }. */
function cleanInput({ name, amount, category }) {
  const cleanName = String(name ?? "").trim();
  if (!cleanName) return { error: "Please enter a name." };
  const value = Math.round(Number(amount) * 100) / 100; // 2 decimals
  if (!Number.isFinite(value) || value <= 0) return { error: "Amount must be more than 0." };
  return { expense: { name: cleanName, amount: value, category: category || DEFAULT_CATEGORY } };
}

/** Run a change on one week's expense list; give a clear message if the budget refuses it. */
function change(data, weekId, edit) {
  const result = applyChange(data, (d) => {
    const week = d.weeks.find((w) => w.id === weekId);
    if (!week) return "Week not found.";
    return edit(week.expenses);
  });
  if (!result.ok && result.error.startsWith("Not allowed")) return { ok: false, error: TOO_MUCH };
  return result;
}

export function addExpense(data, weekId, input) {
  const { expense, error } = cleanInput(input);
  if (error) return { ok: false, error };
  return change(data, weekId, (list) => { list.push(expense); });
}

export function editExpense(data, weekId, index, input) {
  const { expense, error } = cleanInput(input);
  if (error) return { ok: false, error };
  return change(data, weekId, (list) => {
    if (!list[index]) return "Expense not found.";
    list[index] = expense;
  });
}

export function deleteExpense(data, weekId, index) {
  return change(data, weekId, (list) => {
    if (!list[index]) return "Expense not found.";
    list.splice(index, 1);
  });
}