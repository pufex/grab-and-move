const canvas = document.querySelector("#plain")
canvas.ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const map = document.querySelector(".map");
const notes = map.querySelectorAll(".note")

let notesData = [] 
let oldMousePosition = ["",""]
let newMousePosition = ["", ""];

const styleToNumber = (style) => {
    return Number(style.slice(0, style.indexOf("px")));
}

map.addEventListener("mousemove", (e) => {
    oldMousePosition = newMousePosition.slice();
    newMousePosition = [e.clientX, e.clientY].slice();
    console.log(oldMousePosition, newMousePosition);
})

const moveContainer = (el) => {
    let left = styleToNumber(el.style.left);
    let top = styleToNumber(el.style.top); 
    el.style.left = `${newMousePosition[0] - Math.abs(oldMousePosition[0] - left)}px`;
    el.style.top = `${newMousePosition[1] - Math.abs(oldMousePosition[1] - left)}px`;
}

notes.forEach((note, index) => {
    const inViewport = note.getBoundingClientRect();
    const noteData = {id: index, x: inViewport.x, y: inViewport.y, w: inViewport.width, h: inViewport.height} 
    notesData.push(noteData);
    note.style.cursor = "grab";
    note.addEventListener("mousedown", (md) => {
        note.style.cursor = "grabbing"
        note.addEventListener("mousemove", (mm) => {
            moveContainer(note);
        })
        note.addEventListener("mouseup", () => {
            note.style.cursor = "grab"
            note.removeEventListener("mousemove", () => {
                moveContainer(note, [mouseX, mouseY])
            })
        })
    })
})

const drawLines = (ctx) => {
    colors = ["red", "blue", "green", "yellow", "purple"]
    notesData.forEach((note,index) => {
        for(let i = 0; i < colors.length; i++){
            ctx.save();
            ctx.strokeStyle = colors[i%colors.length]
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(window.innerWidth/2, window.innerHeight/2);
            ctx.bezierCurveTo(window.innerWidth/2, window.innerHeight/2+-40+i*10, window.innerWidth/2-40+i*10, window.innerHeight/2-20, note.x+note.w/2, note.y+note.h/2);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    })
}

drawLines(canvas.ctx)
