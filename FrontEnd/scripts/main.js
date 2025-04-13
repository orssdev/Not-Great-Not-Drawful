
const playButton = document.getElementById('play-button');
const menuContent = document.getElementById('menu-content');
let drawingButton = null;

playButton.addEventListener('click', () => {
    playButton.remove();
    const music = document.getElementById('main-music');
    music.play();
    mainMenu();
});

function mainMenu()
{

    const mmButtons = document.createElement('div');
    mmButtons.setAttribute('id', 'MMbuttons')

    const rulesBtn = document.createElement('button');
    rulesBtn.textContent = 'Rules';

    const hostBtn = document.createElement('button');
    hostBtn.textContent = 'Host';

    const joinBtn = document.createElement('button');
    joinBtn.textContent = 'Join';

    const dsBtn = document.createElement('button');
    dsBtn.setAttribute('id', 'drawing-button')
    dsBtn.textContent = 'Drawing';

    mmButtons.appendChild(rulesBtn);
    mmButtons.appendChild(hostBtn);
    mmButtons.appendChild(joinBtn);
    mmButtons.appendChild(dsBtn);

    menuContent.appendChild(mmButtons);
    drawingButton = document.getElementById('drawing-button');

    drawingButton.addEventListener('click', () => {
        drawingSection();
    });
}

function drawingSection()
{
    const theme = document.getElementById('theme')
    theme.href = './css/drawing-section.css';
    const oldWrapper = document.getElementById("wrapper-menu");
    oldWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "wrapper-drawing-section";

    wrapper.innerHTML = `
        <div id="prompt-container">
            <div id="prompt">
                <p></p>
            </div>
            <div id="color-selector">
                <label for="color">Choose a color:</label>
                <select id="color-select" name="cars">
                    <option value="Blue">Blue</option>
                    <option value="Red">Red</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Green">Green</option>
                </select>
                <button id="confirm-color">Confirm</button>
            </div>
            <button id="clear-button">Clear</button>
        </div>
        <div id="drawing">
            <div id="canvas-container">
                <canvas id="drawing-canvas" width="1000" height="700"></canvas>
            </div>
            <div id="controls">
                <div id="colors"></div>
                <div id="brush-size">
                    <div class="size" id="small">
                        <div id="small-size"></div>
                    </div>
                    <div class="size" id="medium">
                        <div id="medium-size"></div>
                    </div>
                    <div class="size" id="large">
                        <div id="large-size"></div>
                    </div>
                </div>
                <button>Submit</button>
            </div>
        </div>
    `;
    document.body.appendChild(wrapper);

    const canvas = document.getElementById('drawing-canvas');
    const inputs = document.getElementById('wrapper-drawing-section');
    const ctx = canvas.getContext('2d');
    const canvasRect = canvas.getBoundingClientRect();
    let color = 'Blue'; 

    let confirmed = false;
    let isPainting = false;
    let lineWidth = 5;
    let startx;
    let starty;

    inputs.addEventListener('click', e => {
        if(e.target.id == 'confirm-color')
        {
            confirmed == true;
            const confirm = document.getElementById('color-selector');
            confirm.remove();
            genColors(color);
        }
        if(e.target.id == 'clear-button')
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if(e.target.id == 'red1')
        {
            ctx.strokeStyle = '#857885';
        }
        else if(e.target.id == 'red2')
        {
            ctx.strokeStyle = '#C25C63';
        }
        else if(e.target.id == 'red3')
        {
            ctx.strokeStyle = '#E14E52';
        }
        else if(e.target.id == 'red4')
        {
            ctx.strokeStyle = '#FF4040';
        }

        if(e.target.id == 'blue1')
        {
            ctx.strokeStyle = '#857885';
        }
        else if(e.target.id == 'blue2')
        {
            ctx.strokeStyle = '#635CC2';
        }
        else if(e.target.id == 'blue3')
        {
            ctx.strokeStyle = '#524EE1';
        }
        else if(e.target.id == 'blue4')
        {
            ctx.strokeStyle = '#4040FF';
        }
        
        if(e.target.id == 'yellow1')
        {
            ctx.strokeStyle = '#858476';
        }
        else if(e.target.id == 'yellow2')
        {
            ctx.strokeStyle = '#C2B35B';
        }
        else if(e.target.id == 'yellow3')
        {
            ctx.strokeStyle = '#E1C94E';
        }
        else if(e.target.id == 'yellow4')
        {
            ctx.strokeStyle = '#FFE240';
        }

        if(e.target.id == 'green1')
        {
            ctx.strokeStyle = '#858476';
        }
        else if(e.target.id == 'green2')
        {
            ctx.strokeStyle = '#97C25B';
        }
        else if(e.target.id == 'green3')
        {
            ctx.strokeStyle = '#A0E14E';
        }
        else if(e.target.id == 'green4')
        {
            ctx.strokeStyle = '#A9FF40';
        }
    });

    inputs.addEventListener('change', e => {
        if(e.target.value == "Yellow")
        {
            color = 'yellow';
        }
        else if(e.target.value == "Red")
        {
            color = 'red';
        }
        else if(e.target.value == "Green")
        {
            color = 'green';
        }
        else
        {
            color = 'blue';
        }
    });

    canvas.addEventListener('mousedown', (e) => {
        isPainting = true;
        startx = e.clientX;
        starty = e.clientY;
    });

    canvas.addEventListener('mouseup', (e) => {
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
    });

    const draw = e => {
        if(!isPainting && !confirmed)
        {
            return ;
        }
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineTo(e.clientX - canvasRect.left - 50, e.clientY - canvasRect.top) + 200;
        ctx.stroke();
    } 

    canvas.addEventListener('mousemove', draw);
}

function genColors(color)
{
    const colors = document.getElementById('colors');

    if(color == 'red')
    {
        const color1 = document.createElement('div');
        const color2 = document.createElement('div');
        const color3 = document.createElement('div');
        const color4 = document.createElement('div');
        color1.setAttribute('class', 'color-button');
        color2.setAttribute('class', 'color-button');
        color3.setAttribute('class', 'color-button');
        color4.setAttribute('class', 'color-button');
        color1.setAttribute('id', 'red1');
        color2.setAttribute('id', 'red2');
        color3.setAttribute('id', 'red3');
        color4.setAttribute('id', 'red4');
        colors.appendChild(color1);
        colors.appendChild(color2);
        colors.appendChild(color3);
        colors.appendChild(color4);
    }
    else if(color == 'yellow')
    {
        const color1 = document.createElement('div');
        const color2 = document.createElement('div');
        const color3 = document.createElement('div');
        const color4 = document.createElement('div');
        color1.setAttribute('class', 'color-button');
        color2.setAttribute('class', 'color-button');
        color3.setAttribute('class', 'color-button');
        color4.setAttribute('class', 'color-button');
        color1.setAttribute('id', 'yellow1');
        color2.setAttribute('id', 'yellow2');
        color3.setAttribute('id', 'yellow3');
        color4.setAttribute('id', 'yellow4');
        colors.appendChild(color1);
        colors.appendChild(color2);
        colors.appendChild(color3);
        colors.appendChild(color4);
    }
    else if(color == 'green')
    {
        const color1 = document.createElement('div');
        const color2 = document.createElement('div');
        const color3 = document.createElement('div');
        const color4 = document.createElement('div');
        color1.setAttribute('class', 'color-button');
        color2.setAttribute('class', 'color-button');
        color3.setAttribute('class', 'color-button');
        color4.setAttribute('class', 'color-button');
        color1.setAttribute('id', 'green1');
        color2.setAttribute('id', 'green2');
        color3.setAttribute('id', 'green3');
        color4.setAttribute('id', 'green4');
        colors.appendChild(color1);
        colors.appendChild(color2);
        colors.appendChild(color3);
        colors.appendChild(color4);
    }
    else
    {
        const color1 = document.createElement('div');
        const color2 = document.createElement('div');
        const color3 = document.createElement('div');
        const color4 = document.createElement('div');
        color1.setAttribute('class', 'color-button');
        color2.setAttribute('class', 'color-button');
        color3.setAttribute('class', 'color-button');
        color4.setAttribute('class', 'color-button');
        color1.setAttribute('id', 'blue1');
        color2.setAttribute('id', 'blue2');
        color3.setAttribute('id', 'blue3');
        color4.setAttribute('id', 'blue4');
        colors.appendChild(color1);
        colors.appendChild(color2);
        colors.appendChild(color3);
        colors.appendChild(color4);
    }
}