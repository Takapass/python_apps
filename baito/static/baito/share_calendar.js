const grid = document.getElementById("calendarGrid");
const label = document.getElementById("monthLabel");
const shiftTitle = document.getElementById("shiftTitle");
const shiftItems = document.getElementById("shiftItems");

let shiftData = {};
let current = new Date();
let selectedCell = null;

/* =====================
   API（共有用）
===================== */
async function loadMonth(year, month) {
    const res = await fetch(`/api/share/${TOKEN}/?year=${year}&month=${month}`);
    shiftData = await res.json();
}

/* =====================
   シフト表示（閲覧のみ）
===================== */
function renderShift(dateStr) {
    shiftTitle.textContent = `${dateStr} のシフト`;
    shiftItems.innerHTML = "";

    const shifts = shiftData[dateStr] || [];

    if (shifts.length === 0) {
        shiftItems.innerHTML = "<li>シフトなし</li>";
        return;
    }

    shifts.forEach(s => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div>${s.start}〜${s.end}</div>
        `;
        shiftItems.appendChild(li);
    });
}

/* =====================
   カレンダー描画
===================== */
function renderCalendar(date) {
    grid.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();
    label.textContent = `${year}年 ${month + 1}月`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        grid.appendChild(document.createElement("div"));
    }

    for (let d = 1; d <= lastDate; d++) {
        const cell = document.createElement("div");
        cell.className = "calendar-day";
        cell.textContent = d;

        const dateStr =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

        if (shiftData[dateStr]) {
            const dot = document.createElement("div");
            dot.className = "shift-dot";
            cell.appendChild(dot);
        }

        cell.onclick = () => {
            if (selectedCell) selectedCell.classList.remove("selected");
            cell.classList.add("selected");
            selectedCell = cell;
            renderShift(dateStr);
        };

        grid.appendChild(cell);
    }
}

/* =====================
   月切替
===================== */
function changeMonth(diff) {
    current.setDate(1);
    current.setMonth(current.getMonth() + diff);
}

document.getElementById("prevMonth").onclick = async () => {
    changeMonth(-1);
    await loadMonth(current.getFullYear(), current.getMonth() + 1);
    renderCalendar(current);
};

document.getElementById("nextMonth").onclick = async () => {
    changeMonth(1);
    await loadMonth(current.getFullYear(), current.getMonth() + 1);
    renderCalendar(current);
};

/* =====================
   初期化
===================== */
async function init() {
    await loadMonth(current.getFullYear(), current.getMonth() + 1);
    renderCalendar(current);
}

init();
