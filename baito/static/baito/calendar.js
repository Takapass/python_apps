const grid = document.getElementById("calendarGrid");
const label = document.getElementById("monthLabel");
const shiftTitle = document.getElementById("shiftTitle");
const shiftItems = document.getElementById("shiftItems");

let current = new Date();

/* 仮データ（あとでDB連携） */
const shiftData = {
    "2026-01-20": ["10:00〜15:00"],
    "2026-01-22": ["18:00〜22:00", "23:00〜25:00"]
};

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
        li.textContent = s;
        shiftItems.appendChild(li);
    });
}

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

        if (
            d === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add("today");
        }

        if (shiftData[dateStr]) {
            const dot = document.createElement("div");
            dot.className = "shift-dot";
            cell.appendChild(dot);
        }

        cell.onclick = () => renderShift(dateStr);

        grid.appendChild(cell);
    }
}

document.getElementById("prevMonth").onclick = () => {
    current.setMonth(current.getMonth() - 1);
    renderCalendar(current);
};

document.getElementById("nextMonth").onclick = () => {
    current.setMonth(current.getMonth() + 1);
    renderCalendar(current);
};

renderCalendar(current);
