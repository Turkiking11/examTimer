const liveClock = document.getElementById("liveClock");
const liveDate = document.getElementById("liveDate");

const heroSubject = document.getElementById("heroSubject");
const heroCountdown = document.getElementById("heroCountdown");

const heroStart = document.getElementById("heroStart");
const heroEnd = document.getElementById("heroEnd");

const activeContainer = document.getElementById("activeContainer");

const progressBar = document.querySelector(".progress-bar");

const statusPill = document.getElementById("statusPill");

const fullscreenBtn = document.getElementById("fullscreenBtn");

fullscreenBtn.addEventListener("click", () => {

    document.documentElement.requestFullscreen();

});

/* =========================
   LIVE CLOCK
========================= */

function updateClock() {

    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formattedHours =
        String(hours % 12 || 12).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";

    liveClock.innerHTML = `
        ${formattedHours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}
        <span>${ampm}</span>
    `;

    liveDate.textContent = now.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });

}

setInterval(updateClock, 1000);
updateClock();

/* =========================
   FLOATING DOTS
========================= */

function createFloatingDots() {

    const colors = [
        "dot-blue",
        "dot-yellow",
        "dot-red"
    ];

    for (let i = 0; i < 18; i++) {

        const dot = document.createElement("div");

        dot.className =
            `floating-dot ${colors[Math.floor(Math.random() * colors.length)]}`;

        dot.style.left = Math.random() * 100 + "%";

        dot.style.top = Math.random() * 100 + "%";

        dot.style.animationDelay =
            Math.random() * 5 + "s";

        dot.style.animationDuration =
            (6 + Math.random() * 6) + "s";

        document.body.appendChild(dot);

    }

}

createFloatingDots();

/* =========================
   TIME UTILITIES
========================= */

function convertTime(timeString) {

    const [hour, minute] = timeString.split(":");

    const date = new Date();

    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);

    return date;

}

function formatTime(ms) {

    const totalSeconds =
        Math.floor(ms / 1000);

    const hours =
        Math.floor(totalSeconds / 3600);

    const minutes =
        Math.floor((totalSeconds % 3600) / 60);

    const seconds =
        totalSeconds % 60;

    return {
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0")
    };

}

/* =========================
   ACTIVE EXAMS
========================= */

function updateExamSystem() {

    const now = new Date();

    activeContainer.innerHTML = "";

    let firstActive = null;

    examSchedule.forEach(exam => {

        const start =
            convertTime(exam.start);

        const end =
            convertTime(exam.end);

        if (now >= start && now <= end) {

            if (!firstActive) {
                firstActive = exam;
            }

            const diff = end - now;

            const formatted =
                formatTime(diff);

            const card =
                document.createElement("div");

            card.className = "active-card";

            card.innerHTML = `
                <h3>${exam.grade}</h3>

                <strong>${exam.subject}</strong>

                <p>
                    ${exam.start} - ${exam.end}
                </p>

                <br>

                <p>
                    ${formatted.hours}:${formatted.minutes}:${formatted.seconds}
                    remaining
                </p>
            `;

            activeContainer.appendChild(card);

        }

    });

    if (firstActive) {

        const start =
            convertTime(firstActive.start);

        const end =
            convertTime(firstActive.end);

        const totalDuration =
            end - start;

        const elapsed =
            now - start;

        const progress =
            (elapsed / totalDuration) * 100;

        progressBar.style.width =
            `${progress}%`;

        const diff = end - now;

        const formatted =
            formatTime(diff);

        heroSubject.innerHTML =
            `<span>${firstActive.grade}</span> — ${firstActive.subject}`;

        heroCountdown.innerHTML = `
            <div class="time-box time-blue">
                ${formatted.hours}
            </div>

            <div class="colon">:</div>

            <div class="time-box time-yellow">
                ${formatted.minutes}
            </div>

            <div class="colon">:</div>

            <div class="time-box time-dark">
                ${formatted.seconds}
            </div>
        `;

        heroStart.textContent =
            firstActive.start;

        heroEnd.textContent =
            firstActive.end;

        if (diff <= 900000) {

            statusPill.textContent =
                "15 MINUTES REMAINING";

            statusPill.style.background =
                "#fff7d6";

            statusPill.style.color =
                "#ca8a04";

        }

        else {

            statusPill.textContent =
                "LIVE NOW";

            statusPill.style.background =
                "#e8fff2";

            statusPill.style.color =
                "#16a34a";

        }

    }

    else {

        heroSubject.innerHTML =
            "No Active Exams";

        heroCountdown.innerHTML = `
            <div class="time-box time-blue">00</div>
            <div class="colon">:</div>
            <div class="time-box time-yellow">00</div>
            <div class="colon">:</div>
            <div class="time-box time-dark">00</div>
        `;

        progressBar.style.width = "0%";

    }

}

updateExamSystem();

setInterval(updateExamSystem, 1000);
