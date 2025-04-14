// Elementos del menú
const menu = document.getElementById('menu');
const colorMatchGame = document.getElementById('colorMatchGame');
const guessColorGame = document.getElementById('guessColorGame');
const colorMixGame = document.getElementById('colorMixGame');
const creativeModeGame = document.getElementById('creativeModeGame');
const colorMatchButton = document.getElementById('colorMatchButton');
const guessColorButton = document.getElementById('guessColorButton');
const colorMixButton = document.getElementById('colorMixButton');
const creativeModeButton = document.getElementById('creativeModeButton');
const backToMenuMatch = document.getElementById('backToMenuMatch');
const backToMenuGuess = document.getElementById('backToMenuGuess');
const backToMenuMix = document.getElementById('backToMenuMix');
const backToMenuCreative = document.getElementById('backToMenuCreative');

// Función para mostrar solo una sección
function showSection(section) {
    menu.style.display = 'none';
    colorMatchGame.style.display = 'none';
    guessColorGame.style.display = 'none';
    colorMixGame.style.display = 'none';
    creativeModeGame.style.display = 'none';
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
creativeModeButton.addEventListener('click', () => {
    showSection(creativeModeGame);
    initCreativeModeGame();
});
backToMenuMatch.addEventListener('click', () => showSection(menu));
backToMenuGuess.addEventListener('click', () => showSection(menu));
backToMenuMix.addEventListener('click', () => showSection(menu));
backToMenuCreative.addEventListener('click', () => showSection(menu));

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
const targetColorDisplay = document.getElementById('targetColorDisplay');
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
    targetColorDisplay.style.backgroundColor = `rgb(${correctColor.r}, ${correctColor.g}, ${correctColor.b})`;
    targetColorDisplay.style.display = 'block';
    colorOptions.style.display = 'none';
    colorOptions.innerHTML = '';
    guessMessageDisplay.textContent = '¡Memoriza este color!';
    
    setTimeout(() => {
        targetColorDisplay.style.display = 'none';
        colorOptions.style.display = 'flex';
        
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
    }, 2000);
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
const mixContainer = document.getElementById('mixContainer');
const mixResult = document.getElementById('mixResult');
const mixMessage = document.getElementById('mixMessage');
const mixAmounts = document.getElementById('mixAmounts');
const clearMix = document.getElementById('clearMix');
const magentaAmount = document.getElementById('magentaAmount');
const cyanAmount = document.getElementById('cyanAmount');
const yellowAmount = document.getElementById('yellowAmount');
const colorSelectButtons = document.querySelectorAll('.color-select');
const adjustButtons = document.querySelectorAll('.adjust');

let mix = { magenta: 0, cyan: 0, yellow: 0 };
let selectedColor = null;
let isDrawing = false;
let ctx;
let lastClickTime = 0;
const DOUBLE_CLICK_THRESHOLD = 300; // ms

function clamp(min, val, max) {
    return Math.min(Math.max(val, min), max);
}

function initColorMixGame() {
    mixCanvas.width = clamp(200, window.innerWidth * 0.8, 300);
    mixCanvas.height = clamp(200, window.innerWidth * 0.8, 300);
    ctx = mixCanvas.getContext('2d');
    clearMixFunc();

    colorSelectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const now = Date.now();
            const color = button.getAttribute('data-color');
            if (now - lastClickTime < DOUBLE_CLICK_THRESHOLD) {
                // Doble clic: añadir 2 unidades
                mix[color] = clamp(0, mix[color] + 2, 10);
                mixMessage.textContent = `Añadiste el doble de ${color}.`;
            } else {
                // Clic simple: añadir 1 unidad
                mix[color] = clamp(0, mix[color] + 1, 10);
                mixMessage.textContent = `Añadiste ${color}.`;
            }
            lastClickTime = now;
            updateMix();
        });
    });

    adjustButtons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.getAttribute('data-color');
            const action = button.getAttribute('data-action');
            mix[color] = clamp(0, mix[color] + (action === 'plus' ? 1 : -1), 10);
            mixMessage.textContent = `${action === 'plus' ? 'Añadiste' : 'Quitaste'} ${color}.`;
            updateMix();
        });
    });

    mixContainer.addEventListener('click', () => {
        if (mix.magenta + mix.cyan + mix.yellow === 0) {
            mixMessage.textContent = 'Añade colores al recipiente primero.';
            return;
        }
        const mixedColor = calculateMixedColor();
        selectedColor = mixedColor.hex();
        mixMessage.textContent = 'Tono seleccionado, ¡pinta en el lienzo!';
        mixResult.textContent = `Tono seleccionado: ${selectedColor}`;
    });

    clearMix.addEventListener('click', clearMixFunc);

    mixCanvas.addEventListener('mousedown', startDrawing);
    mixCanvas.addEventListener('mousemove', draw);
    mixCanvas.addEventListener('mouseup', stopDrawing);
    mixCanvas.addEventListener('mouseleave', stopDrawing);

    mixCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e);
    });
    mixCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
    });
    mixCanvas.addEventListener('touchend', stopDrawing);

    window.addEventListener('resize', () => {
        mixCanvas.width = clamp(200, window.innerWidth * 0.8, 300);
        mixCanvas.height = clamp(200, window.innerWidth * 0.8, 300);
        clearMixFunc();
    });
}

function clearMixFunc() {
    mix = { magenta: 0, cyan: 0, yellow: 0 };
    selectedColor = null;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, mixCanvas.width, mixCanvas.height);
    updateMix();
    mixResult.textContent = 'Tono seleccionado: Ninguno';
    mixMessage.textContent = 'Añade colores al recipiente para crear un tono.';
}

function updateMix() {
    magentaAmount.textContent = mix.magenta;
    cyanAmount.textContent = mix.cyan;
    yellowAmount.textContent = mix.yellow;
    mixAmounts.textContent = `Magenta: ${mix.magenta}, Cian: ${mix.cyan}, Amarillo: ${mix.yellow}`;
    
    if (mix.magenta + mix.cyan + mix.yellow === 0) {
        mixContainer.style.backgroundColor = '#fff';
        return;
    }
    
    const mixedColor = calculateMixedColor();
    mixContainer.style.backgroundColor = mixedColor.hex();
}

function calculateMixedColor() {
    const total = mix.magenta + mix.cyan + mix.yellow;
    if (total === 0) return chroma('#fff');
    
    const colors = [];
    const weights = [];
    
    if (mix.magenta > 0) {
        colors.push('#ff00ff');
        weights.push(mix.magenta);
    }
    if (mix.cyan > 0) {
        colors.push('#00ffff');
        weights.push(mix.cyan);
    }
    if (mix.yellow > 0) {
        colors.push('#ffff00');
        weights.push(mix.yellow);
    }
    
    // Mezcla ponderada usando chroma.js
    let result = colors[0];
    for (let i = 1; i < colors.length; i++) {
        result = chroma.mix(result, colors[i], weights[i] / (weights[i-1] + weights[i]), 'rgb');
    }
    
    return chroma(result);
}

function startDrawing(e) {
    if (!selectedColor) {
        mixMessage.textContent = 'Selecciona un tono haciendo clic en el recipiente.';
        return;
    }
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;

    const rect = mixCanvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
}

// --- Juego 4: Modo Creativo ---
const creativeRedSlider = document.getElementById('creativeRedSlider');
const creativeGreenSlider = document.getElementById('creativeGreenSlider');
const creativeBlueSlider = document.getElementById('creativeBlueSlider');
const creativeRedValue = document.getElementById('creativeRedValue');
const creativeGreenValue = document.getElementById('creativeGreenValue');
const creativeBlueValue = document.getElementById('creativeBlueValue');
const colorPreview = document.getElementById('colorPreview');
const addColorButton = document.getElementById('addColor');
const clearPaletteButton = document.getElementById('clearPalette');
const savePaletteButton = document.getElementById('savePalette');
const sharePaletteButton = document.getElementById('sharePalette');
const exportPaletteButton = document.getElementById('exportPalette');
const paletteContainer = document.getElementById('palette');
const creativeMessage = document.getElementById('creativeMessage');

let palette = [];

function initCreativeModeGame() {
    palette = [];
    creativeRedSlider.value = 0;
    creativeGreenSlider.value = 0;
    creativeBlueSlider.value = 0;
    updateColorPreview();
    renderPalette();
    creativeMessage.textContent = 'Ajusta los sliders para crear un color y añádelo a tu paleta.';
    
    const urlParams = new URLSearchParams(window.location.search);
    const colors = urlParams.get('colors');
    if (colors) {
        palette = colors.split(',').map(hex => `#${hex}`);
        renderPalette();
        creativeMessage.textContent = 'Paleta cargada desde el enlace.';
    }
    
    const savedPalettes = JSON.parse(localStorage.getItem('palettes') || '[]');
    if (savedPalettes.length > 0) {
        creativeMessage.textContent += ' Tienes paletas guardadas disponibles.';
    }
}

function updateColorPreview() {
    const r = parseInt(creativeRedSlider.value);
    const g = parseInt(creativeGreenSlider.value);
    const b = parseInt(creativeBlueSlider.value);
    colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    creativeRedValue.textContent = r;
    creativeGreenValue.textContent = g;
    creativeBlueValue.textContent = b;
}

function rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function renderPalette() {
    paletteContainer.innerHTML = '';
    palette.forEach((color, index) => {
        const colorBox = document.createElement('div');
        colorBox.classList.add('palette-color');
        colorBox.style.backgroundColor = color;
        colorBox.addEventListener('click', () => {
            palette.splice(index, 1);
            renderPalette();
            creativeMessage.textContent = 'Color eliminado de la paleta.';
        });
        paletteContainer.appendChild(colorBox);
    });
}

function addColorToPalette() {
    if (palette.length >= 6) {
        creativeMessage.textContent = '¡Paleta llena! Elimina un color para añadir otro.';
        return;
    }
    const r = parseInt(creativeRedSlider.value);
    const g = parseInt(creativeGreenSlider.value);
    const b = parseInt(creativeBlueSlider.value);
    const hex = `#${rgbToHex(r, g, b)}`;
    palette.push(hex);
    renderPalette();
    creativeMessage.textContent = 'Color añadido a la paleta.';
}

function clearPalette() {
    palette = [];
    renderPalette();
    creativeMessage.textContent = 'Paleta limpiada.';
}

function savePalette() {
    if (palette.length === 0) {
        creativeMessage.textContent = 'La paleta está vacía, añade colores primero.';
        return;
    }
    let savedPalettes = JSON.parse(localStorage.getItem('palettes') || '[]');
    savedPalettes.push(palette);
    localStorage.setItem('palettes', JSON.stringify(savedPalettes));
    creativeMessage.textContent = 'Paleta guardada en el almacenamiento local.';
}

function sharePalette() {
    if (palette.length === 0) {
        creativeMessage.textContent = 'La paleta está vacía, añade colores primero.';
        return;
    }
    const hexColors = palette.map(color => color.replace('#', ''));
    const url = `${window.location.origin}${window.location.pathname}?colors=${hexColors.join(',')}`;
    navigator.clipboard.writeText(url).then(() => {
        creativeMessage.textContent = 'Enlace copiado al portapapeles.';
    }).catch(() => {
        creativeMessage.textContent = 'Error al copiar el enlace.';
    });
}

function exportPalette() {
    if (palette.length === 0) {
        creativeMessage.textContent = 'La paleta está vacía, añade colores primero.';
        return;
    }
    html2canvas(paletteContainer).then(canvas => {
        const link = document.createElement('a');
        link.download = 'palette.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        creativeMessage.textContent = 'Paleta exportada como PNG.';
    }).catch(() => {
        creativeMessage.textContent = 'Error al exportar la paleta.';
    });
}

creativeRedSlider.addEventListener('input', updateColorPreview);
creativeGreenSlider.addEventListener('input', updateColorPreview);
creativeBlueSlider.addEventListener('input', updateColorPreview);
addColorButton.addEventListener('click', addColorToPalette);
clearPaletteButton.addEventListener('click', clearPalette);
savePaletteButton.addEventListener('click', savePalette);
sharePaletteButton.addEventListener('click', sharePalette);
exportPaletteButton.addEventListener('click', exportPalette);

// Mostrar menú al cargar
showSection(menu);