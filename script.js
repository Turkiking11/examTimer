const liveClock = document.getElementById("liveClock");

const examNameInput = document.getElementById("examName");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");

const startExamBtn = document.getElementById("startExamBtn");

const examDisplay = document.getElementById("examDisplay");
const displayExamName = document.getElementById("displayExamName");
const gradesDisplay = document.getElementById("gradesDisplay");

const statusBox = document.getElementById("statusBox");
const countdown = document.getElementById("countdown");

const displayStart = document.getElementById("displayStart");
const displayEnd = document.getElementById("displayEnd");
const remainingText = document.getElementById("remainingText");

let examStarted = false;

function updateClock() {

    const now = new Date();

    liveClock.textContent = now.toLocaleTimeString();

}

setInterval(updateClock, 1000);
updateClock();

startExamBtn.addEventListener("click", () => {

    const examName = examNameInput.value || "Unnamed Exam";

    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;

    if (!startTime || !endTime) {
        alert("Please select start and end times.");
        return;
    }

    const checkedGrades = [
        ...document.querySelectorAll(".grade-card input:checked")
    ].map(input => `Grade ${input.value}`);

    if (checkedGrades.length === 0) {
        alert("Please select at least one grade.");
        return;
    }

    displayExamName.textContent = examName;
    gradesDisplay.textContent = checkedGrades.join(" • ");

    displayStart.textContent = startTime;
    displayEnd.textContent = endTime;

    examDisplay.classList.remove("hidden");

    const now = new Date();

    const startDate = new Date();
    const endDate = new Date();

    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");

    startDate.setHours(startHour, startMinute, 0);
    endDate.setHours(endHour, endMinute, 0);

    if (endDate <= startDate) {
        endDate.setDate(endDate.getDate() + 1);
    }

    if (examStarted) return;

    examStarted = true;

    const timerInterval = setInterval(() => {

        const current = new Date();

        if (current < startDate) {

            statusBox.textContent = "Exam Has Not Started";
            statusBox.style.background = "#f59e0b";

            const diff = startDate - current;

            updateCountdown(diff);

            remainingText.textContent = "Waiting...";

        }

        else if (current >= startDate && current <= endDate) {

            statusBox.textContent = "Exam In Progress";
            statusBox.style.background = "#22c55e";

            const diff = endDate - current;

            updateCountdown(diff);

            remainingText.textContent = formatTime(diff);

        }

        else {

            statusBox.textContent = "Exam Finished";
            statusBox.style.background = "#ef4444";

            countdown.textContent = "00:00:00";
            remainingText.textContent = "Finished";

            clearInterval(timerInterval);

        }

    }, 1000);

});

function updateCountdown(milliseconds) {

    countdown.textContent = formatTime(milliseconds);

}

function formatTime(milliseconds) {

    const totalSeconds = Math.floor(milliseconds / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `
${String(hours).padStart(2, "0")}:
${String(minutes).padStart(2, "0")}:
${String(seconds).padStart(2, "0")}
`.replace(/\s/g, "");

}