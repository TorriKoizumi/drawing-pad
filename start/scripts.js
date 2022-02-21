console.log('connected')
// TODOS
// Select all elements
const canvas = document.querySelector('#drawing-pad')
const toolbar = document.querySelector('.toolbar')
const backgroundPicker = document.querySelector('#background')
const colorPicker = document.querySelector('#color')
const strokeWidthPicker = document.querySelector('#stroke')
const clearCanvasButton = document.querySelector('.toolbar__clear')
// Get canvas context
const ctx = canvas.getContext('2d')

// Create helper to set canvas dimensions
function setCanvasDimentions(){
    const dpr = window.devicePixelRatio || 1

    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr

    canvas.style.height = window.innerHeight + 'px'
    canvas.style.width = window.innerWidth + 'px'

    ctx.scale(dpr,dpr)
}

// Create canvas state values
let isDraw = false
let mouse = {
    x: 0,
    y: 0
}
let currentColor = colorPicker.value
let currentStrokeWidth = strokeWidthPicker.value
let arcs = []


// Create draw function with render loop
function draw(ts){
    // Normalize timestamop to seconds
    ts /= 1000

    // Set Drawing Modes
    canvas.addEventListener('mousedown', () => {
        isDraw = true
    })

    canvas.addEventListener('mouseup', () =>{
        isDraw = false
    })

    // Watch for changes to the toolbar and update current events
    colorPicker.addEventListener('change', (e) => {
        currentColor = e.target.value
    })

    strokeWidthPicker.addEventListener('change', (e) => {
        currentStrokeWidth = e.target.value
    })

    backgroundPicker.addEventListener('change', (e) => {
        canvas.style.background = e.target.value
    })

    // Set updated mouse coodinates
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.layerX
        mouse.y = e.layerY
    })

    if(isDraw){
        // Add all arcs to the state
        arcs.push({
            x: mouse.x,
            y: mouse.y,
            color: currentColor,
            strokeWidth: currentStrokeWidth
        })
        
        // Re-Render each arc per frame
        arcs.map(item => {
            ctx.beginPath()
            ctx.arc(item.x, item.y, item.strokeWidth, 0, 2 * Math.PI)
            ctx.fillStyle = item.color
            ctx.fill()
        })
    }

    // Handle Canvas clear
    clearCanvasButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        arcs = []
    })

    requestAnimationFrame(draw)
}

setCanvasDimentions()
canvas.style.background = backgroundPicker.value
draw()
window.addEventListener('resize', setCanvasDimentions)