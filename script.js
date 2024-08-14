const container = document.getElementById("container");
const color = ["df2222", "224bdf", "df22ac", "22df3e", "d2df22", "13aa83"];
const squares = 500;

for (let i = 0; i < squares; i++) {
  const cuadrado = document.createElement("div");
  cuadrado.classList.add("cuadrado");
  container.appendChild(cuadrado);
}

function recorrerCuadrado() {
  const cuadrados = container.querySelectorAll(".cuadrado");
  cuadrados.forEach(cuadrado => {
    // Evento para cambiar el color al pasar el mouse
    cuadrado.addEventListener("mouseover", () => {
      cuadrado.style.backgroundColor = `#${color[numeroAleatorio()]}`;
    });
    
    // Evento para volver al color inicial al quitar el mouse
    cuadrado.addEventListener("mouseout", () => {
      cuadrado.style.backgroundColor = ""; // Aquí debes poner el color inicial que desees, si es blanco, por ejemplo: "#ffffff"
    });
  });
}

function numeroAleatorio() {
  return Math.floor(Math.random() * color.length);
}

recorrerCuadrado();