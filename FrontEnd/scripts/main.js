
const playButton = document.getElementById('play-button');
const menuContent = document.getElementById('menu-content');
let drawingButton = null;

playButton.addEventListener('click', () => {
    playButton.remove();
    const music = document.getElementById('main-music');
    music.play();

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
});

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
                <canvas width="1000" height="700"></canvas>
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
}