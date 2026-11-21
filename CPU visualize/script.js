
let processes = [];
let schedule = [];
let currentStep = 0;
let animationTimer = null;

const colors = [
    "#2563eb",
    "#059669",
    "#9333ea",
    "#d97706",
    "#0891b2",
    "#db2777",
    "#4f46e5"
];

// Add a process
function addProcess() {
    const pid = document.getElementById("pid").value.trim();
    const arrival = Number(document.getElementById("arrival").value);
    const burst = Number(document.getElementById("burst").value);
    const priority = Number(document.getElementById("priority").value);

    if (!pid || !Number.isInteger(arrival) || arrival < 0 ||
        !Number.isInteger(burst) || burst <= 0 ||
        !Number.isInteger(priority) || priority <= 0) {
        alert("Enter a valid PID, arrival time, burst time and priority.");
        return;
    }

    if (processes.some(p => p.pid.toLowerCase() === pid.toLowerCase())) {
        alert("Process ID must be unique.");
        return;
    }

    processes.push({ pid, arrival, burst, priority });

    clearInputs();
    renderProcessTable();
    resetResults();
}

function clearInputs() {
    document.getElementById("pid").value = "";
    document.getElementById("arrival").value = "";
    document.getElementById("burst").value = "";
    document.getElementById("priority").value = "";
}

function renderProcessTable() {
    const table = document.getElementById("processTable");
    table.innerHTML = "";

    processes.forEach((p, index) => {
        table.innerHTML += `
            <tr>
                <td>${p.pid}</td>
                <td>${p.arrival}</td>
                <td>${p.burst}</td>
                <td>${p.priority}</td>
                <td>
                    <button class="danger"
                    onclick="removeProcess(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function removeProcess(index) {
    processes.splice(index, 1);
    renderProcessTable();
    resetResults();
}

function loadSample() {
    stopTimer();

    processes = [
        { pid: "P1", arrival: 0, burst: 5, priority: 2 },
        { pid: "P2", arrival: 1, burst: 3, priority: 1 },
        { pid: "P3", arrival: 2, burst: 8, priority: 3 },
        { pid: "P4", arrival: 3, burst: 2, priority: 4 }
    ];

    renderProcessTable();
    resetResults();
}

// FCFS Algorithm
function fcfs() {
    const sorted = [...processes].sort(
        (a, b) => a.arrival - b.arrival ||
                  processes.indexOf(a) - processes.indexOf(b)
    );

    let time = 0;
    const result = [];

    sorted.forEach(p => {
        if (time < p.arrival) {
            result.push({
                pid: "IDLE",
                start: time,
                end: p.arrival,
                idle: true
            });
            time = p.arrival;
        }

        const start = time;
        const end = start + p.burst;

        result.push({
            ...p,
            start,
            end,
            ct: end,
            tat: end - p.arrival,
            wt: end - p.arrival - p.burst
        });

        time = end;
    });

    return result;
}

// SJF Non-Preemptive Algorithm
function sjf() {
    const remaining = processes.map((p, index) => ({
        ...p,
        originalIndex: index
    }));

    const result = [];
    let time = 0;

    while (remaining.length > 0) {
        const available = remaining
            .filter(p => p.arrival <= time)
            .sort((a, b) =>
                a.burst - b.burst ||
                a.arrival - b.arrival ||
                a.originalIndex - b.originalIndex
            );

        if (available.length === 0) {
            const nextArrival = Math.min(
                ...remaining.map(p => p.arrival)
            );

            result.push({
                pid: "IDLE",
                start: time,
                end: nextArrival,
                idle: true
            });

            time = nextArrival;
            continue;
        }

        const p = available[0];

        const start = time;
        const end = start + p.burst;

        result.push({
            ...p,
            start,
            end,
            ct: end,
            tat: end - p.arrival,
            wt: end - p.arrival - p.burst
        });

        time = end;

        const index = remaining.findIndex(
            item => item.originalIndex === p.originalIndex
        );

        remaining.splice(index, 1);
    }

    return result;
}

// Run selected algorithm
function runScheduling(type) {
    if (processes.length === 0) {
        alert("Please add processes first.");
        return;
    }

    stopTimer();

    schedule = type === "FCFS" ? fcfs() : sjf();

    document.getElementById("algorithmName").textContent =
        type === "FCFS"
        ? "First Come First Serve (FCFS)"
        : "Shortest Job First (Non-Preemptive)";

    currentStep = 0;

    renderResults(schedule);
    drawGantt(schedule);
    updateAnimation();

    document.getElementById("playBtn").disabled = false;
    document.getElementById("nextBtn").disabled = false;
}

// Display Gantt chart
function drawGantt(data) {
    const chart = document.getElementById("ganttChart");
    const labels = document.getElementById("timeLabels");

    chart.innerHTML = "";
    labels.innerHTML = "";

    data.forEach((item, index) => {
        const block = document.createElement("div");

        block.className = "gantt-block";
        block.id = "block-" + index;

        block.style.background = item.idle
            ? "#64748b"
            : colors[processes.findIndex(p => p.pid === item.pid) % colors.length];

        block.innerHTML = `
            ${item.pid}
            <small>${item.start} - ${item.end}</small>
        `;

        chart.appendChild(block);

        const label = document.createElement("span");
        label.textContent = item.start;
        labels.appendChild(label);
    });

    if (data.length > 0) {
        const finalLabel = document.createElement("span");
        finalLabel.textContent = data[data.length - 1].end;
        labels.appendChild(finalLabel);
    }
}

// Display calculated results
function renderResults(data) {
    const table = document.getElementById("resultTable");
    table.innerHTML = "";

    const completed = data.filter(p => !p.idle);

    completed.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.pid}</td>
                <td>${p.arrival}</td>
                <td>${p.burst}</td>
                <td>${p.ct}</td>
                <td>${p.tat}</td>
                <td>${p.wt}</td>
            </tr>
        `;
    });

    const avgWT = completed.reduce((sum, p) => sum + p.wt, 0)
        / completed.length;

    const avgTAT = completed.reduce((sum, p) => sum + p.tat, 0)
        / completed.length;

    document.getElementById("avgWT").textContent = avgWT.toFixed(2);
    document.getElementById("avgTAT").textContent = avgTAT.toFixed(2);
}

// Animation
function updateAnimation() {
    schedule.forEach((item, index) => {
        const block = document.getElementById("block-" + index);
        block.classList.toggle("active", index < currentStep);
    });

    if (currentStep === 0) {
        document.getElementById("animationStatus").textContent =
            "Ready to start animation.";
    } else if (currentStep <= schedule.length) {
        const item = schedule[currentStep - 1];

        document.getElementById("animationStatus").textContent =
            item.idle
            ? `CPU is IDLE from ${item.start} to ${item.end}.`
            : `${item.pid} executes from ${item.start} to ${item.end}.`;
    }

    if (currentStep >= schedule.length) {
        document.getElementById("animationStatus").textContent =
            "All processes completed!";
    }
}

function nextStep() {
    if (currentStep < schedule.length) {
        currentStep++;
        updateAnimation();
    }
}

function playAnimation() {
    if (schedule.length === 0) return;

    if (currentStep >= schedule.length) {
        currentStep = 0;
        updateAnimation();
    }

    stopTimer();

    document.getElementById("playBtn").textContent = "Playing...";

    animationTimer = setInterval(() => {
        if (currentStep < schedule.length) {
            currentStep++;
            updateAnimation();
        } else {
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    if (animationTimer !== null) {
        clearInterval(animationTimer);
        animationTimer = null;
    }

    const playBtn = document.getElementById("playBtn");
    if (playBtn) playBtn.textContent = "▶ Play";
}

function resetAnimation() {
    stopTimer();
    currentStep = 0;
    updateAnimation();
}

// Compare both algorithms
function compareAlgorithms() {
    if (processes.length === 0) {
        alert("Please add processes first.");
        return;
    }

    const f = fcfs().filter(p => !p.idle);
    const s = sjf().filter(p => !p.idle);

    const avg = data => ({
        wt: data.reduce((sum, p) => sum + p.wt, 0) / data.length,
        tat: data.reduce((sum, p) => sum + p.tat, 0) / data.length
    });

    const fcfsAvg = avg(f);
    const sjfAvg = avg(s);

    document.getElementById("comparison").innerHTML = `
        <table>
            <tr>
                <th>Algorithm</th>
                <th>Average WT</th>
                <th>Average TAT</th>
            </tr>
            <tr>
                <td>FCFS</td>
                <td>${fcfsAvg.wt.toFixed(2)}</td>
                <td>${fcfsAvg.tat.toFixed(2)}</td>
            </tr>
            <tr>
                <td>SJF</td>
                <td>${sjfAvg.wt.toFixed(2)}</td>
                <td>${sjfAvg.tat.toFixed(2)}</td>
            </tr>
        </table>
    `;
}

function resetResults() {
    stopTimer();
    schedule = [];
    currentStep = 0;

    document.getElementById("ganttChart").innerHTML = "";
    document.getElementById("timeLabels").innerHTML = "";
    document.getElementById("resultTable").innerHTML = "";
    document.getElementById("avgWT").textContent = "-";
    document.getElementById("avgTAT").textContent = "-";
    document.getElementById("algorithmName").textContent =
        "Select an algorithm";
    document.getElementById("animationStatus").textContent =
        "Run an algorithm to view the Gantt chart.";
    document.getElementById("comparison").innerHTML = "";

    document.getElementById("playBtn").disabled = true;
    document.getElementById("nextBtn").disabled = true;
}

// Start with sample data
loadSample();
