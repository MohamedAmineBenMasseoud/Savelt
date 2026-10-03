// views/dashboard.js: savings goal, current week, available to spend, expenses.
// Input: `computed` = computeWeeks(...) result, `goal` = savings goal. Output: an HTML string.
import { savingsSummary, totals } from "../calc.js";
import { formatRange, money } from "../utils.js";
import { expenseRows, goalCard } from "./parts.js";

function emptyState() {
  return `
    <div class="card empty">
      <h3>No weeks yet</h3>
      <p>Tell the app how much you received this week.</p>
      <button class="btn" data-action="add-week">+ Add Week</button>
    </div>`;
}

function currentWeekCard(w) {
  const none = w.remaining < 0.005; // nothing left to spend
  return `
    <div class="card">
      <div class="week-head">
        <div><h2>Week ${w.number}</h2><p>${formatRange(w.startDate)} · Monday to Sunday</p></div>
        <button class="iconbtn light" title="Edit week" data-action="edit-week" data-week="${w.id}"><img src="icons/SaveIt_icons/edit.png" alt="Edit week"> Edit</button>
      </div>
      <div class="line"><span>Money received</span><span>${money(w.received)}</span></div>
      <div class="line"><span>Carry-over from previous week</span><span>${money(w.carry)}</span></div>
      <div class="line total"><span>Total available</span><span>${money(w.total)}</span></div>
      <div class="line"><span>Savings</span><span>−${money(w.saved)}</span></div>
      <div class="available ${none ? "none" : ""}">
        <span>REMAINING TO SPEND</span><strong>${money(w.remaining)}</strong>
      </div>
    </div>`;
}

function expensesCard(w) {
  const n = w.expenses.length;
  return `
    <div class="card">
      <div class="section-title"><h3>This Week’s Expenses</h3><span class="small">${n} item${n === 1 ? "" : "s"}</span></div>
      ${expenseRows(w)}
      <button class="add" data-action="add-expense" data-week="${w.id}">+ Add Expense</button>
    </div>`;
}

function summaryCard(computed) {
  const t = totals(computed);
  const s = savingsSummary(computed);
  return `
    <div class="card">
      <div class="section-title"><h3>Quick summary</h3><span class="small">${computed.length} week${computed.length === 1 ? "" : "s"}</span></div>
      <div class="line"><span>Total received</span><span>${money(t.received)}</span></div>
      <div class="line"><span>Total expenses</span><span>${money(t.spent)}</span></div>
      <div class="line"><span>Saved</span><span>${money(s.saved)}</span></div>
    </div>`;
}

export function renderDashboard(computed, goal) {
  const hero = goalCard(computed, goal);
  if (!computed.length) return hero + emptyState();
  const current = computed[computed.length - 1]; // latest week
  return hero + currentWeekCard(current) + expensesCard(current) + summaryCard(computed);
}