// views/parts.js: small HTML pieces shared by several screens.
// Views only build HTML strings. Clicks are handled in app.js through data-action attributes.
import { savingsSummary } from "../calc.js";
import { iconFor } from "../expenses.js";
import { escapeHtml, money } from "../utils.js";

/** Savings goal card: saved amount, progress bar, goal. */
export function goalCard(computed, goal) {
  const s = savingsSummary(computed, goal);
  return `
    <div class="card hero">
      <div class="kicker"><img class="mini-icon" src="icons/SaveIt_icons/sack-dollar.png" alt="Savings Goal"> Savings Goal</div>
      <h2>${money(s.saved)} saved</h2>
      <div class="progress"><span style="width:${s.percent}%"></span></div>
      <div class="progressrow">
        <span>${s.percent.toFixed(1)}%</span>
        <span>Goal: ${goal} TND</span>
      </div>
    </div>`;
}

/** List of one week's expenses with edit and delete buttons. */
export function expenseRows(week) {
  if (!week.expenses.length) return `<div class="empty">No expenses yet.</div>`;
  return week.expenses
    .map(
      (e, i) => `
    <div class="expense">
      <div class="exp-icon"><img class="category-icon" src="${iconFor(e.category)}" alt="${escapeHtml(e.category || "Other")}"></div>
      <div class="expense-main"><strong>${escapeHtml(e.name)}</strong><span>${escapeHtml(e.category || "Other")}</span></div>
      <div class="amount">−${money(e.amount)}</div>
      <button class="iconbtn" title="Edit" data-action="edit-expense" data-week="${week.id}" data-index="${i}"><img src="icons/SaveIt_icons/edit-outline.png" alt="Edit expense"></button>
      <button class="iconbtn" title="Delete" data-action="delete-expense" data-week="${week.id}" data-index="${i}"><img src="icons/SaveIt_icons/uninstall.png" alt="Delete expense"></button>
    </div>`
    )
    .join("");
}