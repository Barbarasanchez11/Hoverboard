const container = document.getElementById("container")
const color = ["df2222", "224bdf", "df22ac","22df3e", "d2df22"]
const squares = 500

for(let i = 0, i < squares, i++) {
    const cuadrado= document.createElement("div")
    cuadrado.classList.add("cuadrado")
}

container.forEach(cuadrado => {
    cuadrado.addEventListener ("mouseover", () => {
        cuadrado.style.backgroundColor = "df2222"
    })
    
});