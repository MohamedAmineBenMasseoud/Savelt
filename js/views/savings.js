// views/savings.js: savings goal, progress, savings history, and data backup buttons.
// Input: `computed` = computeWeeks(...) result, `goal` = savings goal. Output: an HTML string.
import { savingsSummary } from "../calc.js";
import { formatDate, money } from "../utils.js";
import { goalCard } from "./parts.js";

function allocationCard(computed, goal) {
  const s = savingsSummary(computed, goal);
  const pace = computed.length ? computed[computed.length - 1].saved : null;
  const paceLabel = pace !== null && pace !== undefined ? `${money(pace)} TND / week` : "Chosen each week";
  return `
    <div class="card">
      <div class="section-title"><h3>Savings allocation</h3><span class="small">Automatic</span></div>
      <div class="line"><span><img class="mini-icon" src="icons/SaveIt_icons/sack-dollar.png" alt="Savings"> Savings</span><b>${paceLabel}</b></div>
      <div class="line"><span><img class="mini-icon" src="icons/SaveIt_icons/calendar.png" alt="Weeks recorded"> Weeks recorded</span><b>${computed.length}</b></div>
      <div class="line"><span>Total saved</span><b>${money(s.saved)}</b></div>
      <div class="line"><span><img class="mini-icon" src="icons/SaveIt_icons/bullseye.png" alt="Weeks to goal"> Weeks to goal</span><b>${s.weeksLeft}</b></div>
      <button class="add" data-action="edit-goal">Change goal (${goal} TND)</button>
    </div>`;
}

function historyCard(computed) {
  const rows = computed.length
    ? [...computed]
        .reverse()
        .map(
          (w) => `
      <div class="line">
        <span>Week ${w.number} · ${formatDate(w.startDate, true)}</span>
        <b>+${money(w.saved)}</b>
      </div>`
        )
        .join("")
    : `<div class="empty">Savings will appear here after you add your first week.</div>`;
  return `
    <div class="card">
      <div class="section-title"><h3>Savings history</h3></div>
      ${rows}
    </div>`;
}

function dataCard() {
  return `
    <div class="card">
      <div class="section-title"><h3><img class="mini-icon" src="icons/SaveIt_icons/file-send.png" alt="My data"> My data</h3><span class="small">Saved on this device</span></div>
      <div class="data-actions">
        <button class="btn" data-action="export">Export my budget</button>
        <button class="btn danger" data-action="reset">Reset all data</button>
      </div>
    </div>`;
}

export function renderSavings(computed, goal) {
  return `
    <div class="section-title"><h3>Savings Overview</h3></div>
    ${goalCard(computed, goal)}
    ${allocationCard(computed, goal)}
    ${historyCard(computed)}
    ${dataCard()}`;
}