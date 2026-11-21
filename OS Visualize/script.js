
let results = {};
let current = null;
let step = 0;
let timer = null;

// Calculate total head movement
function calculateMovement(path) {
    let total = 0;

    for (let i = 1; i < path.length; i++) {
        total += Math.abs(path[i] - path[i - 1]);
    }

    return total;
}

// FCFS
function FCFS(requests, head) {
    return [head, ...requests];
}

// SSTF
function SSTF(requests, head) {
    let arr = [...requests];
    let path = [head];
    let pos = head;

    while (arr.length > 0) {
        let nearest = 0;

        for (let i = 1; i < arr.length; i++) {
            if (
                Math.abs(arr[i] - pos) <
                Math.abs(arr[nearest] - pos) ||
                (Math.abs(arr[i] - pos) ===
                Math.abs(arr[nearest] - pos) &&
                arr[i] < arr[nearest])
            ) {
                nearest = i;
            }
        }

        pos = arr.splice(nearest, 1)[0];
        path.push(pos);
    }

    return path;
}

// SCAN
function SCAN(requests, head, size, direction) {
    let left = requests.filter(x => x < head).sort((a,b) => a-b);
    let right = requests.filter(x => x >= head).sort((a,b) => a-b);

    let path = [head];

    if (direction === "right") {
        path.push(...right);

        if (path[path.length - 1] !== size - 1)
            path.push(size - 1);

        path.push(...left.reverse());
    } else {
        path.push(...left.reverse());

        if (path[path.length - 1] !== 0)
            path.push(0);

        path.push(...right);
    }

    return path;
}

// C-SCAN
function CSCAN(requests, head, size, direction) {
    let left = requests.filter(x => x < head).sort((a,b) => a-b);
    let right = requests.filter(x => x >= head).sort((a,b) => a-b);

    let path = [head];

    if (direction === "right") {
        path.push(...right);

        if (path[path.length - 1] !== size - 1)
            path.push(size - 1);

        if (path[path.length - 1] !== 0)
            path.push(0);

        path.push(...left);
    } else {
        path.push(...left.reverse());

        if (path[path.length - 1] !== 0)
            path.push(0);

        if (path[path.length - 1] !== size - 1)
            path.push(size - 1);

        path.push(...right.reverse());
    }

    return path;
}

// LOOK
function LOOK(requests, head, direction) {
    let left = requests.filter(x => x < head).sort((a,b) => a-b);
    let right = requests.filter(x => x >= head).sort((a,b) => a-b);

    let path = [head];

    if (direction === "right") {
        path.push(...right);
        path.push(...left.reverse());
    } else {
        path.push(...left.reverse());
        path.push(...right);
    }

    return path;
}

// Get service sequence without initial head and
// disk boundary/wrap movements.
function getService(path, requests) {
    let remaining = [...requests];
    let service = [];

    for (let i = 1; i < path.length; i++) {
        let index = remaining.indexOf(path[i]);

        if (index !== -1) {
            service.push(path[i]);
            remaining.splice(index, 1);
        }
    }

    return service;
}

// Run all algorithms
function runAll() {
    clearInterval(timer);
    document.getElementById("error").innerText = "";

    let size = Number(document.getElementById("size").value);
    let head = Number(document.getElementById("head").value);

    let requests = document.getElementById("queue")
        .value.split(",").map(x => Number(x.trim()));

    let direction = document.getElementById("direction").value;

    if (!Number.isInteger(size) || size < 2 ||
        !Number.isInteger(head) || head < 0 ||
        head >= size || requests.length === 0 ||
        requests.some(x => !Number.isInteger(x) || x < 0 || x >= size)) {

        document.getElementById("error").innerText =
            "Please enter valid disk size, head position and requests.";
        return;
    }

    let algorithms = {
        "FCFS": FCFS(requests, head),
        "SSTF": SSTF(requests, head),
        "SCAN": SCAN(requests, head, size, direction),
        "C-SCAN": CSCAN(requests, head, size, direction),
        "LOOK": LOOK(requests, head, direction)
    };

    results = {};

    for (let name in algorithms) {
        let path = algorithms[name];

        results[name] = {
            path: path,
            service: getService(path, requests),
            total: calculateMovement(path)
        };
    }

    showResults();
    drawBarGraph();
    selectAlgorithm("FCFS");
}

// Display results
function showResults() {
    let output = "";

    for (let name in results) {
        output += `
            <h3>${name}</h3>
            Service Sequence:
            ${results[name].service.join(" → ")}
            <br>
            Total Head Movement:
            ${results[name].total}
            cylinders
            <hr>
        `;
    }

    document.getElementById("results").innerHTML = output;
}

// Select algorithm
function selectAlgorithm(name) {
    if (!results[name]) return;

    clearInterval(timer);

    current = results[name];
    step = 0;

    document.getElementById("algorithm").innerText = name;
    document.getElementById("movement").innerText = current.total;

    document.getElementById("sequence").innerText =
        "Service Sequence: " + current.service.join(" → ");

    drawSeekGraph(0);
}

// Draw seek graph
function drawSeekGraph(upto) {
    let canvas = document.getElementById("seekGraph");
    let ctx = canvas.getContext("2d");

    let size = Number(document.getElementById("size").value);
    let path = current.path;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let left = 50;
    let top = 25;
    let bottom = 300;
    let width = 820;

    ctx.strokeStyle = "#ddd";

    for (let i = 0; i <= 5; i++) {
        let y = top + i * 55;

        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(870, y);
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.fillText(
            Math.round((size - 1) * (1 - i / 5)),
            10, y + 5
        );
    }

    let x = i => left + i * width /
        Math.max(1, path.length - 1);

    let y = value => bottom -
        value / (size - 1) * (bottom - top);

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i <= upto; i++) {
        if (i === 0)
            ctx.moveTo(x(i), y(path[i]));
        else
            ctx.lineTo(x(i), y(path[i]));
    }

    ctx.stroke();

    for (let i = 0; i <= upto; i++) {
        ctx.beginPath();
        ctx.arc(x(i), y(path[i]), 5, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
    }

    ctx.fillStyle = "black";
    ctx.fillText("Request Order →", 400, 330);
    ctx.fillText("Cylinder Number ↑", 50, 15);
}

// Animation: next step
function nextStep() {
    if (!current) return;

    if (step < current.path.length - 1) {
        step++;
        drawSeekGraph(step);
    }
}

// Play animation
function playAnimation() {
    if (!current) return;

    clearInterval(timer);

    if (step >= current.path.length - 1)
        step = 0;

    timer = setInterval(() => {
        if (step < current.path.length - 1) {
            nextStep();
        } else {
            clearInterval(timer);
        }
    }, 650);
}

// Reset animation
function resetAnimation() {
    if (!current) return;

    clearInterval(timer);
    step = 0;
    drawSeekGraph(0);
}

// Comparison bar chart
function drawBarGraph() {
    let canvas = document.getElementById("barGraph");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let names = Object.keys(results);
    let max = Math.max(...names.map(n => results[n].total), 1);

    names.forEach((name, i) => {
        let y = 30 + i * 60;
        let value = results[name].total;
        let barWidth = value / max * 650;

        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText(name, 10, y + 25);

        ctx.fillStyle = "#1769aa";
        ctx.fillRect(110, y, barWidth, 35);

        ctx.fillStyle = "black";
        ctx.fillText(value, 120 + barWidth, y + 25);
    });
}

runAll();
