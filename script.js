const liveClock =
    document.getElementById("liveClock");

const liveDate =
    document.getElementById("liveDate");

const heroSubject =
    document.getElementById("heroSubject");

const heroCountdown =
    document.getElementById("heroCountdown");

const heroStart =
    document.getElementById("heroStart");

const heroEnd =
    document.getElementById("heroEnd");

const activeContainer =
    document.getElementById("activeContainer");

const progressBar =
    document.getElementById("progressBar");

const statusPill =
    document.getElementById("statusPill");

const fullscreenBtn =
    document.getElementById("fullscreenBtn");

/* FULLSCREEN */

fullscreenBtn.addEventListener("click", () => {

    document.documentElement.requestFullscreen();

});

/* LIVE CLOCK */

function updateClock() {

    const now = new Date();

    const hours =
        now.getHours();

    const minutes =
        now.getMinutes();

    const seconds =
        now.getSeconds();

    const formattedHours =
        String(hours % 12 || 12).padStart(2, "0");

    const ampm =
        hours >= 12 ? "PM" : "AM";

    liveClock.innerHTML = `
        ${formattedHours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}
        <span>${ampm}</span>
    `;

    liveDate.textContent =
        now.toLocaleDateString(undefined, {

            weekday: "long",

            month: "long",

            day: "numeric",

            year: "numeric"

        });

}

setInterval(updateClock, 1000);

updateClock();

/* TIME UTILITIES */

function convertTime(timeString) {

    const [hour, minute] =
        timeString.split(":");

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

        hours:
            String(hours).padStart(2, "0"),

        minutes:
            String(minutes).padStart(2, "0"),

        seconds:
            String(seconds).padStart(2, "0")

    };

}

/* MAIN EXAM SYSTEM */

function updateExamSystem() {

    const now = new Date();

    activeContainer.innerHTML = "";

    let firstActive = null;

    examSchedule.forEach(exam => {

        const start =
            convertTime(exam.start);

        const end =
            convertTime(exam.end);

        if (
            now >= start &&
            now <= end
        ) {

            if (!firstActive) {
                firstActive = exam;
            }

            const diff =
                end - now;

            const formatted =
                formatTime(diff);

            const card =
                document.createElement("div");

            card.className =
                "active-card";

            card.innerHTML = `

                <h3>
                    ${exam.grade}
                </h3>

                <strong>
                    ${exam.subject}
                </strong>

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

    /* HERO */

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

        const diff =
            end - now;

        const formatted =
            formatTime(diff);

        heroSubject.innerHTML = `
            <span>
                ${firstActive.grade}
            </span>

            — ${firstActive.subject}
        `;

        heroCountdown.innerHTML = `

            <div class="time-box time-blue">
                ${formatted.hours}
            </div>

            <div class="colon">
                :
            </div>

            <div class="time-box time-yellow">
                ${formatted.minutes}
            </div>

            <div class="colon">
                :
            </div>

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

        }

        else {

            statusPill.textContent =
                "● LIVE NOW";

        }

    }

    else {

        heroSubject.innerHTML =
            "No Active Exams";

    }

}

updateExamSystem();

setInterval(updateExamSystem, 1000);
