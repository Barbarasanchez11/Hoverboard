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

let score = 0;
let targetColor = { r: 0, g: 0, b: 0 };

// Genera un color RGB aleatorio
function getRandomColor() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    };
}

// Actualiza el color del usuario en tiempo real
function updateUserColor() {
    const r = parseInt(redSlider.value);
    const g = parseInt(greenSlider.value);
    const b = parseInt(blueSlider.value);
    userColorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    redValue.textContent = r;
    greenValue.textContent = g;
    blueValue.textContent = b;
}

// Calcula la distancia euclidiana entre dos colores RGB
function calculateColorDistance(color1, color2) {
    const rDiff = color1.r - color2.r;
    const gDiff = color1.g - color2.g;
    const bDiff = color1.b - color2.b;
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

// Inicia una nueva ronda
function startRound() {
    targetColor = getRandomColor();
    targetColorBox.style.backgroundColor = `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`;
    // Resetea sliders
    redSlider.value = 0;
    greenSlider.value = 0;
    blueSlider.value = 0;
    updateUserColor();
    messageDisplay.textContent = '';
}

// Verifica el color del usuario
function checkColor() {
    const userColor = {
        r: parseInt(redSlider.value),
        g: parseInt(greenSlider.value),
        b: parseInt(blueSlider.value)
    };
    const distance = calculateColorDistance(targetColor, userColor);
    // La distancia máxima posible es ~441.67 (sqrt(255^2 * 3)), normalizamos a una puntuación de 0-100
    const maxDistance = Math.sqrt(255 * 255 * 3);
    const points = Math.max(0, Math.round(100 * (1 - distance / maxDistance)));
    
    score += points;
    scoreDisplay.textContent = `Puntuación: ${score}`;
    messageDisplay.textContent = `¡Obtuviste ${points} puntos! La diferencia fue de ${Math.round(distance)}.`;
    
    // Inicia nueva ronda tras 2 segundos
    setTimeout(startRound, 2000);
}

// Event listeners
redSlider.addEventListener('input', updateUserColor);
greenSlider.addEventListener('input', updateUserColor);
blueSlider.addEventListener('input', updateUserColor);
submitButton.addEventListener('click', checkColor);

// Inicia el juego
startRound();