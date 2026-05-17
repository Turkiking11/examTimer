const liveClock = document.getElementById("liveClock");
const liveDate = document.getElementById("liveDate");

const countdown = document.getElementById("countdown");

const currentExamTitle = document.getElementById("currentExamTitle");

const statusPill = document.getElementById("statusPill");

const startTimeText = document.getElementById("startTime");
const endTimeText = document.getElementById("endTime");
const remainingText = document.getElementById("remainingText");

const scheduleContainer = document.getElementById("scheduleContainer");

const activeExamsContainer = document.getElementById("activeExams");
const upcomingExamsContainer = document.getElementById("upcomingExams");

const fullscreenBtn = document.getElementById("fullscreenBtn");

fullscreenBtn.addEventListener("click", () => {

    document.documentElement.requestFullscreen();

});

function updateClock() {

    const now = new Date();

    liveClock.textContent = now.toLocaleTimeString();

    liveDate.textContent = now.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

}

setInterval(updateClock, 1000);
updateClock();

function convertToDate(timeString) {

    const [hour, minute] = timeString.split(":");

    const date = new Date();

    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);

    return date;

}

function formatTime(ms) {

    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}

function updateSystem() {

    const now = new Date();

    scheduleContainer.innerHTML = "";

    activeExamsContainer.innerHTML = "";
    upcomingExamsContainer.innerHTML = "";

    let activeExam = null;

    examSchedule.forEach(exam => {

        const start = convertToDate(exam.start);
        const end = convertToDate(exam.end);

        let state = "upcoming";

        if (now >= start && now <= end) {
            state = "active";
        }

        else if (now > end) {
            state = "finished";
        }

        const card = document.createElement("div");

        card.className = `schedule-card ${state}`;

        card.innerHTML = `
            <div class="schedule-grade">${exam.grade}</div>
            <div class="schedule-subject">${exam.subject}</div>
            <div class="schedule-time">${exam.start} - ${exam.end}</div>
        `;

        scheduleContainer.appendChild(card);

        if (state === "active") {

            activeExam = exam;

            const activeItem = document.createElement("div");

            activeItem.className = "exam-list-item";

            activeItem.innerHTML = `
                <strong>${exam.grade}</strong>
                <span>${exam.subject}</span>
            `;

            activeExamsContainer.appendChild(activeItem);

        }

        if (state === "upcoming") {

            const upcomingItem = document.createElement("div");

            upcomingItem.className = "exam-list-item";

            upcomingItem.innerHTML = `
                <strong>${exam.grade}</strong>
                <span>${exam.subject} • ${exam.start}</span>
            `;

            upcomingExamsContainer.appendChild(upcomingItem);

        }

    });

    if (activeExam) {

        const end = convertToDate(activeExam.end);

        const diff = end - now;

        countdown.textContent = formatTime(diff);

        currentExamTitle.textContent =
            `${activeExam.grade} — ${activeExam.subject}`;

        startTimeText.textContent = activeExam.start;
        endTimeText.textContent = activeExam.end;

        remainingText.textContent = formatTime(diff);

        statusPill.textContent = "EXAM IN PROGRESS";
        statusPill.style.background = "#22c55e";

        if (diff <= 900000 && diff > 300000) {
            statusPill.textContent = "15 MINUTES REMAINING";
            statusPill.style.background = "#f59e0b";
        }

        if (diff <= 300000) {
            statusPill.textContent = "5 MINUTES REMAINING";
            statusPill.style.background = "#ef4444";
        }

    }

    else {

        countdown.textContent = "00:00:00";

        currentExamTitle.textContent = "No Active Exam";

        startTimeText.textContent = "--:--";
        endTimeText.textContent = "--:--";

        remainingText.textContent = "Waiting";

        statusPill.textContent = "WAITING";
        statusPill.style.background = "#f59e0b";

    }

}

updateSystem();

setInterval(updateSystem, 1000);
