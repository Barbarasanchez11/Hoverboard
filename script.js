// Elementos del menú
const menu = document.getElementById('menu');
const colorMatchGame = document.getElementById('colorMatchGame');
const guessColorGame = document.getElementById('guessColorGame');
const colorMixGame = document.getElementById('colorMixGame');
const colorMatchButton = document.getElementById('colorMatchButton');
const guessColorButton = document.getElementById('guessColorButton');
const colorMixButton = document.getElementById('colorMixButton');
const backToMenuMatch = document.getElementById('backToMenuMatch');
const backToMenuGuess = document.getElementById('backToMenuGuess');
const backToMenuMix = document.getElementById('backToMenuMix');

// Función para mostrar solo una sección
function showSection(section) {
    menu.style.display = 'none';
    colorMatchGame.style.display = 'none';
    guessColorGame.style.display = 'none';
    colorMixGame.style.display = 'none';
    section.style.display = 'flex';
}

// Event listeners para el menú
colorMatchButton.addEventListener('click', () => {
    showSection(colorMatchGame);
    startColorMatchRound();
});
guessColorButton.addEventListener('click', () => {
    showSection(guessColorGame);
    startGuessColorRound();
});
colorMixButton.addEventListener('click', () => {
    showSection(colorMixGame);
    initColorMixGame();
});
backToMenuMatch.addEventListener('click', () => showSection(menu));
backToMenuGuess.addEventListener('click', () => showSection(menu));
backToMenuMix.addEventListener('click', () => showSection(menu));

// --- Juego 1: Combinación de Colores ---
const targetColorBox = document.getElementById('targetColor');
const userColorBox = document.getElementById('userColor');
const redSlider = document.getElementById('redSlider');
const greenSlider = document.getElementById('greenSlider');
const blueSlider = document.getElementById('blueSlider');
const redValue = document.getElementById('redValue');
const greenValue = document.getElementById('greenValue');
const blueValue = document.getElementById('blueValue');
const submitButton = document.getElementById('submitButton');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');

let colorMatchScore = 0;
let targetColor = { r: 0, g: 0, b: 0 };

function getRandomColor() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    };
}

function updateUserColor() {
    const r = parseInt(redSlider.value);
    const g = parseInt(greenSlider.value);
    const b = parseInt(blueSlider.value);
    userColorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    redValue.textContent = r;
    greenValue.textContent = g;
    blueValue.textContent = b;
}

function calculateColorDistance(color1, color2) {
    const rDiff = color1.r - color2.r;
    const gDiff = color1.g - color2.g;
    const bDiff = color1.b - color2.b;
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

function startColorMatchRound() {
    targetColor = getRandomColor();
    targetColorBox.style.backgroundColor = `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`;
    redSlider.value = 0;
    greenSlider.value = 0;
    blueSlider.value = 0;
    updateUserColor();
    messageDisplay.textContent = '';
}

function checkColorMatch() {
    const userColor = {
        r: parseInt(redSlider.value),
        g: parseInt(greenSlider.value),
        b: parseInt(blueSlider.value)
    };
    const distance = calculateColorDistance(targetColor, userColor);
    const maxDistance = Math.sqrt(255 * 255 * 3);
    const points = Math.max(0, Math.round(100 * (1 - distance / maxDistance)));
    
    colorMatchScore += points;
    scoreDisplay.textContent = `Puntuación: ${colorMatchScore}`;
    messageDisplay.textContent = `¡Obtuviste ${points} puntos! La diferencia fue de ${Math.round(distance)}.`;
    
    setTimeout(startColorMatchRound, 2000);
}

redSlider.addEventListener('input', updateUserColor);
greenSlider.addEventListener('input', updateUserColor);
blueSlider.addEventListener('input', updateUserColor);
submitButton.addEventListener('click', checkColorMatch);

// --- Juego 2: Adivina el Color ---
const colorCodeDisplay = document.getElementById('colorCode');
const colorOptions = document.getElementById('colorOptions');
const timerDisplay = document.getElementById('timer');
const guessScoreDisplay = document.getElementById('guessScore');
const guessMessageDisplay = document.getElementById('guessMessage');

let guessScore = 0;
let level = 1;
let timeLeft = 10;
let timerInterval;
let correctColor;

function getSimilarColor(baseColor, maxDiff) {
    return {
        r: Math.min(255, Math.max(0, baseColor.r + Math.floor(Math.random() * maxDiff * 2 - maxDiff))),
        g: Math.min(255, Math.max(0, baseColor.g + Math.floor(Math.random() * maxDiff * 2 - maxDiff))),
        b: Math.min(255, Math.max(0, baseColor.b + Math.floor(Math.random() * maxDiff * 2 - maxDiff)))
    };
}

function startGuessColorRound() {
    const maxDiff = level <= 3 ? 100 : level <= 6 ? 50 : 30;
    timeLeft = level <= 3 ? 10 : level <= 6 ? 8 : 5;
    
    correctColor = getRandomColor();
    colorCodeDisplay.textContent = `RGB(${correctColor.r}, ${correctColor.g}, ${correctColor.b})`;
    colorOptions.innerHTML = '';
    
    const options = [correctColor];
    for (let i = 0; i < 3; i++) {
        options.push(getSimilarColor(correctColor, maxDiff));
    }
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(option => {
        const optionBox = document.createElement('div');
        optionBox.classList.add('color-option');
        optionBox.style.backgroundColor = `rgb(${option.r}, ${option.g}, ${option.b})`;
        optionBox.addEventListener('click', () => checkGuessColor(option));
        colorOptions.appendChild(optionBox);
    });
    
    timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            guessMessageDisplay.textContent = '¡Tiempo agotado!';
            guessMessageDisplay.style.color = 'red';
            setTimeout(startGuessColorRound, 2000);
        }
    }, 1000);
    
    guessMessageDisplay.textContent = '';
}

function checkGuessColor(selectedColor) {
    clearInterval(timerInterval);
    if (selectedColor.r === correctColor.r &&
        selectedColor.g === correctColor.g &&
        selectedColor.b === correctColor.b) {
        guessScore += 10 * level;
        guessMessageDisplay.textContent = '¡Correcto!';
        guessMessageDisplay.style.color = 'green';
        level = Math.min(level + 1, 10);
    } else {
        guessScore = Math.max(0, guessScore - 5);
        guessMessageDisplay.textContent = 'Intenta de nuevo.';
        guessMessageDisplay.style.color = 'red';
    }
    guessScoreDisplay.textContent = `Puntuación: ${guessScore}`;
    setTimeout(startGuessColorRound, 2000);
}

// --- Juego 3: Mezcla de Colores ---
const mixCanvas = document.getElementById('mixCanvas');
const mixResult = document.getElementById('mixResult');
const mixMessage = document.getElementById('mixMessage');
const clearCanvas = document.getElementById('clearCanvas');
const colorSelectButtons = document.querySelectorAll('.color-select');

let currentColor = [255, 0, 0]; // Rojo por defecto
let isDrawing = false;
let ctx;

function initColorMixGame() {
    // Inicializar lienzo con dimensiones responsivas
    mixCanvas.width = clamp(200, window.innerWidth * 0.8, 300);
    mixCanvas.height = clamp(200, window.innerWidth * 0.8, 300);
    ctx = mixCanvas.getContext('2d');
    clearCanvasFunc();

    // Selección de color
    colorSelectButtons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.getAttribute('data-color');
            currentColor = color === 'red' ? [255, 0, 0] :
                          color === 'green' ? [0, 255, 0] :
                          [0, 0, 255];
            mixMessage.textContent = `Pintando con ${color === 'red' ? 'rojo' : color === 'green' ? 'verde' : 'azul'}.`;
        });
    });

    // Limpieza del lienzo
    clearCanvas.addEventListener('click', clearCanvasFunc);

    // Eventos de dibujo
    mixCanvas.addEventListener('mousedown', startDrawing);
    mixCanvas.addEventListener('mousemove', draw);
    mixCanvas.addEventListener('mouseup', stopDrawing);
    mixCanvas.addEventListener('mouseleave', stopDrawing);

    // Eventos táctiles
    mixCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e);
    });
    mixCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
    });
    mixCanvas.addEventListener('touchend', stopDrawing);

    // Ajustar lienzo al redimensionar
    window.addEventListener('resize', () => {
        mixCanvas.width = clamp(200, window.innerWidth * 0.8, 300);
        mixCanvas.height = clamp(200, window.innerWidth * 0.8, 300);
        clearCanvasFunc();
    });
}

function clamp(min, val, max) {
    return Math.min(Math.max(val, min), max);
}

function clearCanvasFunc() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, mixCanvas.width, mixCanvas.height);
    mixResult.textContent = 'Color resultante: RGB(0, 0, 0)';
    mixMessage.textContent = 'Selecciona un color y pinta en el lienzo.';
}

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath(); // Evitar líneas continuas
}

function draw(e) {
    if (!isDrawing) return;

    const rect = mixCanvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.fillStyle = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();

    updateResultColor();
}

function updateResultColor() {
    const imageData = ctx.getImageData(0, 0, mixCanvas.width, mixCanvas.height);
    const data = imageData.data;
    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < data.length; i += 4) {
        // Excluir fondo blanco
        if (data[i + 3] > 0 && !(data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255)) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }
    }

    if (count > 0) {
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        mixResult.textContent = `Color resultante: RGB(${r}, ${g}, ${b})`;

        // Detectar combinaciones comunes con chroma.js
        try {
            const hsl = chroma([r, g, b]).hsl();
            if (hsl[1] > 0.2) { // Evitar grises
                if (Math.abs(hsl[0] - 300) < 30) {
                    mixMessage.textContent = '¡Has creado un tono morado (rojo + azul)!';
                } else if (Math.abs(hsl[0] - 60) < 30) {
                    mixMessage.textContent = '¡Has creado un tono amarillo (rojo + verde)!';
                } else if (Math.abs(hsl[0] - 180) < 30) {
                    mixMessage.textContent = '¡Has creado un tono cian (verde + azul)!';
                } else {
                    mixMessage.textContent = `Mezcla personalizada: RGB(${r}, ${g}, ${b})`;
                }
            } else {
                mixMessage.textContent = 'Mezcla poco definida, ¡prueba combinar más colores!';
            }
        } catch (e) {
            mixMessage.textContent = 'Error al calcular el color, sigue pintando.';
        }
    }
}

// Mostrar menú al cargar
showSection(menu);