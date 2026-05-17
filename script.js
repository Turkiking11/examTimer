
const loginOverlay = document.getElementById("loginOverlay");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const liveClock = document.getElementById("liveClock");
const liveDate = document.getElementById("liveDate");

const heroGrade = document.getElementById("heroGrade");
const heroSubject = document.getElementById("heroSubject");
const heroCountdown = document.getElementById("heroCountdown");

const heroStart = document.getElementById("heroStart");
const heroEnd = document.getElementById("heroEnd");
const heroStatus = document.getElementById("heroStatus");

const statusPill = document.getElementById("statusPill");

const activeContainer = document.getElementById("activeContainer");
const scheduleList = document.getElementById("scheduleList");

const gradeInput = document.getElementById("gradeInput");
const subjectInput = document.getElementById("subjectInput");
const startInput = document.getElementById("startInput");
const endInput = document.getElementById("endInput");

const addExamBtn = document.getElementById("addExamBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

loginBtn.addEventListener("click", () => {

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        loginOverlay.style.display = "none";

    }

    else {

        loginError.textContent = "Invalid username or password";

    }

});

fullscreenBtn.addEventListener("click", () => {

    document.documentElement.requestFullscreen();

});

addExamBtn.addEventListener("click", () => {

    const grade = gradeInput.value;
    const subject = subjectInput.value;
    const start = startInput.value;
    const end = endInput.value;

    if (!grade || !subject || !start || !end) {
        return;
    }

    examSchedule.push({
        grade,
        subject,
        start,
        end
    });

    renderSchedule();

    gradeInput.value = "";
    subjectInput.value = "";
    startInput.value = "";
    endInput.value = "";

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

function convertTime(time) {

    const [hour, minute] = time.split(":");

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

function renderSchedule() {

    scheduleList.innerHTML = "";

    examSchedule.forEach((exam, index) => {

        const item = document.createElement("div");

        item.className = "schedule-item";

        item.innerHTML = `
            <strong>${exam.grade} — ${exam.subject}</strong>
            <span>${exam.start} - ${exam.end}</span>
        `;

        scheduleList.appendChild(item);

    });

}

function updateExams() {

    activeContainer.innerHTML = "";

    const now = new Date();

    let firstActive = null;

    examSchedule.forEach(exam => {

        const start = convertTime(exam.start);
        const end = convertTime(exam.end);

        if (now >= start && now <= end) {

            if (!firstActive) {
                firstActive = exam;
            }

            const item = document.createElement("div");

            item.className = "active-item";

            item.innerHTML = `
                <strong>${exam.grade}</strong>
                <span>${exam.subject}</span>
            `;

            activeContainer.appendChild(item);

        }

    });

    if (firstActive) {

        const end = convertTime(firstActive.end);

        const diff = end - now;

        heroGrade.textContent = firstActive.grade;
        heroSubject.textContent = `${firstActive.subject} Examination`;

        heroCountdown.textContent = formatTime(diff);

        heroStart.textContent = firstActive.start;
        heroEnd.textContent = firstActive.end;

        heroStatus.textContent = "Running";

        statusPill.textContent = "LIVE EXAMS";
        statusPill.style.background = "#22c55e";

        if (diff <= 900000) {

            statusPill.textContent = "15 MINUTES REMAINING";
            statusPill.style.background = "#f59e0b";

        }

        if (diff <= 300000) {

            statusPill.textContent = "5 MINUTES REMAINING";
            statusPill.style.background = "#ef4444";

        }

    }

    else {

        heroGrade.textContent = "No Active Grade";
        heroSubject.textContent = "Waiting For Exams";

        heroCountdown.textContent = "00:00:00";

        heroStart.textContent = "--:--";
        heroEnd.textContent = "--:--";

        heroStatus.textContent = "Waiting";

        statusPill.textContent = "WAITING";
        statusPill.style.background = "#2563eb";

    }

}

renderSchedule();

updateExams();

setInterval(updateExams, 1000);

