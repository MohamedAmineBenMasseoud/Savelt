// app.js: connects everything. Holds the state, draws the current screen, and reacts to clicks.
// Expects in index.html: <main id="view"></main> and nav buttons with data-page="dashboard|history|savings".
import { computeWeeks, WEEKLY_SAVINGS } from "./calc.js";
import { CATEGORIES, DEFAULT_CATEGORY, addExpense, deleteExpense, editExpense } from "./expenses.js";
import { confirmDialog, openForm } from "./modal.js";
import { clear, createEmpty, exportData, importFile, load, save } from "./store.js";
import { renderDashboard } from "./views/dashboard.js";
import { renderHistory } from "./views/history.js";
import { renderSavings } from "./views/savings.js";
import { addWeek, deleteWeek, editWeek, suggestSaved, suggestedStart } from "./weeks.js";
import { money } from "./utils.js";

// ---------- state ----------
let data = load();
let page = "dashboard";
let openIds = null; // which History cards are open (null = only the latest)

const view = document.getElementById("view");

function render() {
  const computed = computeWeeks(data.weeks);
  document.querySelectorAll("[data-page]").forEach((b) => b.classList.toggle("active", b.dataset.page === page));
  view.innerHTML =
    page === "history" ? renderHistory(computed, openIds)
    : page === "savings" ? renderSavings(computed, data.goal)
    : renderDashboard(computed, data.goal);
}

/** Take the result of a weeks/expenses function: on success store it, save it and redraw. */
function commit(result) {
  if (result.ok) {
    data = result.data;
    if (!save(data)) alert("Could not save on this device. Export a backup to be safe.");
    render();
  }
  return result; // forms use this to show the error inside the popup
}

function warn(result) {
  if (!result.ok) alert(result.error);
}

const findWeek = (id) => data.weeks.find((w) => w.id === id);

// ---------- forms ----------
function openAddWeek() {
  const computed = computeWeeks(data.weeks);
  const last = computed[computed.length - 1];
  const suggested = suggestSaved(data);
  openForm({
    title: "Add Week",
    note: last
      ? `Carry-over from Week ${last.number}: <b>${money(last.remaining)}</b> (automatic). Saving for this week: <b>${money(suggested)}</b>.`
      : `First week: carry-over <b>0.00 TND</b>. Saving for this week: <b>${money(suggested)}</b>.`,
    fields: [
      { id: "startDate", label: "Week start (Monday)", type: "date", value: suggestedStart(data) },
      { id: "received", label: "Money received (TND)", type: "number", value: last ? last.received : "", attrs: 'min="0" step="0.01" placeholder="20.00"' },
      { id: "saved", label: "How much do you want to save this week? (TND)", type: "number", value: suggested, attrs: `min="0" step="0.01" placeholder="${money(WEEKLY_SAVINGS)}"` },
    ],
    submitLabel: "Create Week",
    onSubmit: (v) => {
      const result = commit(addWeek(data, v));
      if (result.ok) openIds = null; // let the new week open by default
      return result;
    },
  });
}

function openEditWeek(id) {
  const w = findWeek(id);
  if (!w) return;
  openForm({
    title: "Edit Week",
    fields: [
      { id: "startDate", label: "Week start (Monday)", type: "date", value: w.startDate },
      { id: "received", label: "Money received (TND)", type: "number", value: w.received, attrs: 'min="0" step="0.01"' },
      { id: "saved", label: "How much do you want to save this week? (TND)", type: "number", value: w.saved ?? WEEKLY_SAVINGS, attrs: 'min="0" step="0.01"' },
    ],
    onSubmit: (v) => commit(editWeek(data, id, v)),
  });
}

function expenseForm(weekId, index) {
  const w = findWeek(weekId);
  if (!w) return;
  const editing = index !== null;
  const e = editing ? w.expenses[index] : { name: "", amount: "", category: DEFAULT_CATEGORY };
  if (!e) return;
  const categories = Object.keys(CATEGORIES);
  if (!categories.includes(e.category)) categories.push(e.category);
  openForm({
    title: editing ? "Edit Expense" : "Add Expense",
    fields: [
      { id: "name", label: "Name", value: e.name, attrs: 'placeholder="Water"' },
      { id: "amount", label: "Amount (TND)", type: "number", value: e.amount, attrs: 'min="0.01" step="0.01" placeholder="1.00"' },
      { id: "category", label: "Category", options: categories, value: e.category },
    ],
    submitLabel: editing ? "Save" : "Add Expense",
    onSubmit: (v) => commit(editing ? editExpense(data, weekId, index, v) : addExpense(data, weekId, v)),
  });
}

function openEditGoal() {
  openForm({
    title: "Savings goal",
    fields: [{ id: "goal", label: "Goal (TND)", type: "number", value: data.goal, attrs: 'min="10" step="10"' }],
    onSubmit: (v) => {
      const goal = Number(v.goal);
      if (!Number.isFinite(goal) || goal < 10) return { ok: false, error: "The goal must be at least 10 TND." };
      return commit({ ok: true, data: { ...data, goal } });
    },
  });
}

// ---------- actions (buttons with data-action) ----------
const actions = {
  "add-week": () => openAddWeek(),
  "edit-week": (el) => openEditWeek(el.dataset.week),
  "delete-week": async (el) => {
    const ok = await confirmDialog({
      title: "Delete this week?",
      message: "Its expenses will be deleted too, and the following weeks will be recalculated.",
      confirmLabel: "Delete week",
      danger: true,
    });
    if (ok) warn(commit(deleteWeek(data, el.dataset.week)));
  },
  "add-expense": (el) => expenseForm(el.dataset.week, null),
  "edit-expense": (el) => expenseForm(el.dataset.week, Number(el.dataset.index)),
  "delete-expense": async (el) => {
    const ok = await confirmDialog({ title: "Delete this expense?", message: "This cannot be undone.", confirmLabel: "Delete", danger: true });
    if (ok) warn(commit(deleteExpense(data, el.dataset.week, Number(el.dataset.index))));
  },
  "edit-goal": () => openEditGoal(),
  export: () => exportData(data),
  import: () => fileInput.click(),
  reset: async () => {
    const ok = await confirmDialog({
      title: "Delete ALL data?",
      message: "Every week and expense on this device will be erased. Export a backup first if you might need it.",
      confirmLabel: "Delete everything",
      danger: true,
    });
    if (!ok) return;
    clear();
    openIds = null;
    commit({ ok: true, data: createEmpty() });
  },
};

document.addEventListener("click", (e) => {
  const pageBtn = e.target.closest("[data-page]");
  if (pageBtn) {
    page = pageBtn.dataset.page;
    render();
    window.scrollTo(0, 0);
    return;
  }
  const el = e.target.closest("[data-action]");
  if (el && actions[el.dataset.action]) actions[el.dataset.action](el);
});

// remember which History cards are open so they stay open after a redraw
document.addEventListener(
  "toggle",
  (e) => {
    if (e.target.matches && e.target.matches("details.history-week")) {
      openIds = new Set([...document.querySelectorAll("details.history-week[open]")].map((d) => d.dataset.week));
    }
  },
  true
);

// ---------- import ----------
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = ".json,application/json";
fileInput.hidden = true;
document.body.appendChild(fileInput);
fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  fileInput.value = "";
  if (!file) return;
  try {
    const imported = await importFile(file);
    const ok = await confirmDialog({
      title: "Import this backup?",
      message: `It contains ${imported.weeks.length} week(s). It will replace the budget currently on this device.`,
      confirmLabel: "Replace my data",
      danger: true,
    });
    if (ok) {
      openIds = null;
      commit({ ok: true, data: imported });
    }
  } catch (err) {
    alert("Import failed: " + err.message);
  }
});

render();