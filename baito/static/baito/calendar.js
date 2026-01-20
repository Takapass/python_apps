const grid = document.getElementById("calendarGrid");
const label = document.getElementById("monthLabel");
const shiftTitle = document.getElementById("shiftTitle");
const shiftItems = document.getElementById("shiftItems");

const monthModal = document.getElementById("monthModal");
const monthGrid = document.getElementById("monthGrid");
const modalYearLabel = document.getElementById("modalYear");

let shiftData = {};
let current = new Date();
let selectedCell = null;
let modalYear = current.getFullYear();

function resetSelection() {
    selectedDate = null;

    document.querySelectorAll(".calendar-day.selected").forEach(el => {
        el.classList.remove("selected");
    });

    const list = document.getElementById("shiftList");
    if (list) {
        list.innerHTML = "";
    }

    const summary = document.getElementById("shiftSummary");
    if (summary) {
        summary.textContent = "勤務時間：0時間 / 給料：0円";
    }
}

/* API */
async function loadMonth(year, month) {
    const res = await fetch(`/api/shifts/?year=${year}&month=${month}`);
    shiftData = await res.json();
}

/* シフト表示 */
function renderShift(dateStr) {
    shiftTitle.textContent = `${dateStr} のシフト`;
    shiftItems.innerHTML = "";

    const shifts = shiftData[dateStr] || [];
    let totalHours = 0;
    let totalPay = 0;

    if (shifts.length === 0) {
        shiftItems.innerHTML = "<li>シフトなし</li>";
    }

    shifts.forEach(s => {
        totalHours += s.hours;
        totalPay += s.pay;

        const li = document.createElement("li");
        li.innerHTML = `
            <div>${s.start}〜${s.end}</div>
            <div style="margin-top:6px;">
                <a href="/sift/?id=${s.id}">編集</a>
                <a href="/delete/${s.id}/" style="color:red; margin-left:8px;">削除</a>
            </div>
        `;
        shiftItems.appendChild(li);
    });

    document.getElementById("totalHours").textContent = totalHours.toFixed(2);
    document.getElementById("totalPay").textContent =
        Math.floor(totalPay).toLocaleString();
}

/* カレンダー描画 */
function renderCalendar(date) {
    grid.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();
    label.textContent = `${year}年 ${month + 1}月`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();

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

        if (
            d === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add("today");
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

/* 月変更 */
function changeMonth(diff) {
    current.setDate(1);
    current.setMonth(current.getMonth() + diff);
}

/* モーダル（月表 */
function openMonthModal() {
    modalYear = current.getFullYear();
    renderMonthGrid();
    monthModal.classList.remove("hidden");
}

function renderMonthGrid() {
    modalYearLabel.textContent = modalYear + "年";
    monthGrid.innerHTML = "";

    for (let m = 0; m < 12; m++) {
        const btn = document.createElement("button");
        btn.textContent = `${m + 1}月`;

        if (modalYear === current.getFullYear() && m === current.getMonth()) {
            btn.classList.add("active");
        }

        btn.onclick = async () => {
            current.setFullYear(modalYear);
            current.setMonth(m);
            await loadMonth(current.getFullYear(), current.getMonth() + 1);
            renderCalendar(current);
            resetSelection();
            monthModal.classList.add("hidden");
        };

        monthGrid.appendChild(btn);
    }
}

label.onclick = openMonthModal;
document.getElementById("yearPrev").onclick = () => {
    modalYear--;
    renderMonthGrid();
};
document.getElementById("yearNext").onclick = () => {
    modalYear++;
    renderMonthGrid();
};

monthModal.onclick = e => {
    if (e.target === monthModal) monthModal.classList.add("hidden");
};

document.getElementById("prevMonth").onclick = async () => {
    changeMonth(-1);
    await loadMonth(current.getFullYear(), current.getMonth() + 1);
    resetSelection();
    renderCalendar(current);
};

document.getElementById("nextMonth").onclick = async () => {
    changeMonth(1);
    await loadMonth(current.getFullYear(), current.getMonth() + 1);
    resetSelection();
    renderCalendar(current);
};

async function init() {
    await loadMonth(current.getFullYear(), current.getMonth() + 1);
    renderCalendar(current);
}

init();
