// views/history.js: every week, newest first, each one openable to see exactly what was spent.
// Input: `computed` = computeWeeks(...) result.
// `openIds` (optional Set of week ids) keeps weeks open after a re-render; by default only the latest is open.
import { formatRange, num } from "../utils.js";
import { expenseRows } from "./parts.js";

function weekCard(w, isCurrent, open) {
  return `
    <details class="card history-week" data-week="${w.id}" ${open ? "open" : ""}>
      <summary>
        <span>Week ${w.number}${isCurrent ? " · Current" : ""}</span>
        <span class="small">${formatRange(w.startDate)}</span>
      </summary>
      <div class="history-body">
        <div class="history-stats">
          <div class="mini"><span>Received</span><b>${num(w.received)}</b></div>
          <div class="mini"><span>Carry-over</span><b>${num(w.carry)}</b></div>
          <div class="mini"><span>Savings</span><b>−${num(w.saved)}</b></div>
          <div class="mini"><span>Expenses</span><b>${num(w.spent)}</b></div>
          <div class="mini"><span>Remaining</span><b>${num(w.remaining)}</b></div>
        </div>
        <div class="small">WEEK ${w.number} PURCHASE HISTORY</div>
        ${expenseRows(w)}
        <button class="add" data-action="add-expense" data-week="${w.id}">+ Add Expense</button>
        <div class="week-actions">
          <button class="btn secondary" data-action="edit-week" data-week="${w.id}">Edit week</button>
          <button class="btn danger" data-action="delete-week" data-week="${w.id}">Delete week</button>
        </div>
      </div>
    </details>`;
}

export function renderHistory(computed, openIds = null) {
  if (!computed.length) {
    return `
      <div class="card empty">
        <p>No weeks recorded yet.</p>
        <button class="btn" data-action="add-week">+ Add Week</button>
      </div>`;
  }
  const latest = computed.length - 1;
  const weeks = computed
    .map((w, i) => weekCard(w, i === latest, openIds ? openIds.has(w.id) : i === latest))
    .reverse(); // newest first
  return `<div class="section-title"><h3>History All Weeks</h3></div>${weeks.join("")}`;
}