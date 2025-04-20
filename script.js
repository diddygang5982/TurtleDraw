const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("fileInput");
const drawButton = document.getElementById("drawButton");
const clearButton = document.getElementById("clearButton");
const distanceDisplay = document.getElementById("distance");

let totalDistance = 0;

// Clear canvas
clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    totalDistance = 0;
    distanceDisplay.textContent = "0";
});

// Draw from file
drawButton.addEventListener("click", () => {
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file first!");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        processCommands(content);
    };
    reader.readAsText(file);
});

function processCommands(content) {
    const commands = content.split("\n");
    let isPenDown = true;
    let prevX = canvas.width / 2; // Start at center
    let prevY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    totalDistance = 0;

    commands.forEach((line) => {
        line = line.trim();
        if (!line) return;

        const parts = line.split(" ");
        if (parts[0].toLowerCase() === "stop") {
            isPenDown = false;
            return;
        }

        const color = parts[0];
        const x = parseInt(parts[1]);
        const y = parseInt(parts[2]);

        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);

        // Convert coordinates (Turtle-style to Canvas-style)
        const canvasX = canvas.width / 2 + x;
        const canvasY = canvas.height / 2 - y; // Invert Y-axis

        if (isPenDown) {
            ctx.lineTo(canvasX, canvasY);
            ctx.stroke();
            
            // Calculate distance (Pythagoras)
            const dx = x - (prevX - canvas.width / 2);
            const dy = (prevY - canvas.height / 2) - y;
            totalDistance += Math.sqrt(dx * dx + dy * dy);
        } else {
            isPenDown = true; // Pen down again after stop
        }

        prevX = canvasX;
        prevY = canvasY;
    });

    distanceDisplay.textContent = totalDistance.toFixed(2);
}
