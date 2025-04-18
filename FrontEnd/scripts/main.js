const socket = io();
const playButton = document.getElementById('play-button');
const menuContent = document.getElementById('menu-content');

let username = "";

playButton.addEventListener('click', () => {
    playButton.remove();
    const music = document.getElementById('main-music');
    music.play();
    mainMenu();
});


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function mainMenu()
{
    const mmButtons = document.createElement('div');
    mmButtons.setAttribute('id', 'MMbuttons')

    const rulesBtn = document.createElement('button');
    rulesBtn.textContent = 'Rules';

    const hostBtn = document.createElement('button');
    hostBtn.setAttribute('id', 'host-button')
    hostBtn.textContent = 'Host';

    const joinBtn = document.createElement('button');
    joinBtn.setAttribute('id', 'join-button')
    joinBtn.textContent = 'Join';

    // const dsBtn = document.createElement('button');
    // dsBtn.setAttribute('id', 'drawing-button')
    // dsBtn.textContent = 'Drawing';

    mmButtons.appendChild(rulesBtn);
    mmButtons.appendChild(hostBtn);
    mmButtons.appendChild(joinBtn);
    // mmButtons.appendChild(dsBtn);

    menuContent.appendChild(mmButtons);
    const hostButton = document.getElementById('host-button');

    hostButton.addEventListener('click', () => {
        socket.emit("create-room");
        socket.on("room-created", (object) => {
          hostSection(object.joinCode);
        });

        console.log(socket.listeners("room-joined"));
    });

    const joinButton = document.getElementById('join-button');

    joinButton.addEventListener('click', () => {
        joinSection();
        const joinBtn = document.getElementById("join-button");
        joinBtn.addEventListener("click", () => {
          const playerName = document.getElementById("player-name").value;
          const joinCode = document.getElementById("join-code").value;

          if (playerName != "" && joinCode != "") {
            username = playerName;
            socket.emit("join-room", { playerName: playerName, joinCode: joinCode });
            socket.on("room-joined", (object) => {
              console.log(object);
              waiting();
            });

            socket.on("start-drawing", (prompt) => {
              drawingSection(prompt);
            });

            socket.on("describe-drawing", (imageObject) => {
              describeSection(imageObject);
            });

            socket.on("start-voting", (currentDrawings) => {
              let votingQueue = currentDrawings.slice();
              voting(votingQueue);
            });

            socket.on("show-leaderboard", (scores) => {
              leaderboard(scores);
            });
          }
        });
    });
}

function winner()
{
    const theme = document.getElementById('theme')
    theme.href = './css/winner.css';
    const oldWrapper = document.getElementById("wrapper");
    oldWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "wrapper";

    wrapper.innerHTML = `
        <H1>Winner!</H1>
        <div class="player" id="player"></div>
    `;

    document.body.appendChild(wrapper);
}

function leaderboard(scores)
{
    console.log(scores);
    const keys = Object.keys(scores);
    const values = Object.values(scores);
    const theme = document.getElementById('theme')
    theme.href = './css/leaderboard.css';
    const oldWrapper = document.getElementById("wrapper");
    oldWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "wrapper";

    wrapper.innerHTML = `
        <h1>Leaderboard</h1>
        <div id="players">
        </div>
    `;

    document.body.appendChild(wrapper);

    const players = document.getElementById('players')
    for(let i = 0; i < keys.length; i++)
    {
        const player = document.createElement('div');
        player.setAttribute('class', 'player');
        player.innerHTML = `${keys[i]}: ${values[i]}`
        players.appendChild(player);
    }
}

function hostVoting(currentDrawings)
{
    console.log("if you see this, you are in the host voting section");
    const drawing = currentDrawings.pop();
    let options = drawing.guesses.slice();
    options.push({user: "", desc: drawing.correctDesc});
    shuffleArray(options);
    const theme = document.getElementById('theme')
    theme.href = './css/hostvoting.css';
    const oldWrapper = document.getElementById("wrapper");
    oldWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "wrapper";

    wrapper.innerHTML = `
        <div id="header">
            <H1>What is this???</H1>
        </div>
        <div id="content">
            <div class="description-container">
                <div class="description" id="description1">${options.length >= 1 ? options[0].desc : ""}</div>
                <div class="description" id="description2">${options.length >= 2 ? options[1].desc : ""}</div>
            </div>
            <img id="image" src="../assets/img.png">
            <div class="description-container">
                <div class="description" id="description3">${options.length >= 3 ? options[2].desc : ""}</div>
                <div class="description" id="description4">${options.length >= 4 ? options[3].desc : ""}</div>
            </div>
    `;

    document.body.appendChild(wrapper);

    const image = document.getElementById('image');
    image.src = drawing.img;
}

function voting(currentDrawings)
{
    const drawing = currentDrawings.pop();
    let options = drawing.guesses.slice();
    options.push({user: "", desc: drawing.correctDesc});
    shuffleArray(options);
    options = options.filter((option) => option.user != username);
    const theme = document.getElementById('theme')
    theme.href = './css/voting.css';
    const oldWrapper = document.getElementById("wrapper");
    oldWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "wrapper";

    wrapper.innerHTML = `
        <H1>Choose!</H1>
        <button id="option1">${options.length >= 1 ? options[0].desc : ""}</button>
        <button id="option2">${options.length >= 2 ? options[1].desc : ""}</button>
        <button id="option3">${options.length >= 3 ? options[2].desc : ""}</button>
    `;
    document.body.appendChild(wrapper);

    if (drawing.user == username){
      waiting();
    }

    const option1 = document.getElementById('option1');
    const option2 = document.getElementById('option2');
    const option3 = document.getElementById('option3');

    option1.addEventListener('click', () => {
      waiting();
      socket.emit("submit-vote", { user: username, artist: drawing.user, trickster: options[0].user});
    });

    option2.addEventListener('click', () => {
      waiting();
      socket.emit("submit-vote", { user: username, artist: drawing.user, trickster: options[1].user});
    });

    option3.addEventListener('click', () => {
      waiting();
      socket.emit("submit-vote", { user: username, artist: drawing.user, trickster: options[2].user});
    });
}

function describeSection(imageObject)
{
    console.log(imageObject);
    const theme = document.getElementById('theme')
    theme.href = './css/describe.css';
    const oldWrapper = document.getElementById("wrapper");
    oldWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "wrapper";

    wrapper.innerHTML = `
        <h1>Describe this: </h1>
        <img id="image" src="../assets/img.png">
        <div id="input-container">
            <input id="description" type="text">
            <button id="submit-button">Submit</button>
        </div>
    `;
    document.body.appendChild(wrapper);

    if (imageObject.user === username) {
      waiting();
    }

    let image = document.getElementById('image');
    image.src = imageObject.img;

    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', () => {
      socket.emit("submit-description", imageObject, {
        user: username,
        desc: document.getElementById('description').value
      });
      waiting();
    });
}


function hostWaiting(object)
{
    const theme = document.getElementById('theme')
    theme.href = './css/hostwaiting.css';
    const oldWrapper = document.getElementById("wrapper");
    oldWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "wrapper";

    wrapper.innerHTML = `
        <div id="heading">
            <h1>Waiting for players to finish...</h1>
        </div>
        <div id="content">
            <div id="players">
                <h2>Players</h2>
            </div>
            <div id="timer-container">
                <h1 id="time-remaining">01:00</h1>
            </div>
        </div>
    `;

    document.body.appendChild(wrapper);

    const players = document.getElementById('players');
    console.log(object.userNames);
    for (let i = 0; i < object.userNames.length; i++) {
        const player = document.createElement('div');
        player.setAttribute('class', 'player');
        player.innerHTML = `${object.userNames[i]}`;
        players.appendChild(player);
    }

    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 60);
    // huh?
    // https://www.w3schools.com/howto/howto_js_countdown.asp
    let x = setInterval(function() {
    // Get today's date and time
    let now = new Date().getTime();

    // Find the distance between now and the count down date
    let distance = deadline - now;

    // Time calculations for days, hours, minutes and seconds
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById('time-remaining').innerHTML = `00:${String(seconds).padStart(2, '0')}`;

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById('time-remaining').innerHTML = "EXPIRED";
    } }, 1000);
}

function waiting()
{
    const theme = document.getElementById('theme')
    theme.href = './css/waiting.css';
    const oldWrapper = document.getElementById("wrapper");
    oldWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "wrapper";

    wrapper.innerHTML = `
        <h1>Waiting for other players...</h1>
    `;
    document.body.appendChild(wrapper);
}

function joinSection()
{
    const theme = document.getElementById('theme')
    theme.href = './css/join.css';
    const oldWrapper = document.getElementById("wrapper");
    oldWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "wrapper";

    wrapper.innerHTML = `
        <div id="header">
            <h1>Join a Game!</h1>
        </div>
        <div id="inputs">
            <h3>Name:</h3>
            <input type="text" id="player-name">

            <h3>Code:</h3>
            <input type="text" id="join-code">
        </div>
        <button id="join-button">Join</button>
    `;
    document.body.appendChild(wrapper);
}

function hostSection(joinCode)
{
    let gameObject = {};

    const theme = document.getElementById('theme')
    theme.href = './css/host.css';
    const oldWrapper = document.getElementById("wrapper");
    oldWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "wrapper";

    wrapper.innerHTML = `
        <div id="heading">
            <h1>Hosting...</h1>
            <h2>Room Code: ${joinCode}</h2>
        </div>
        <div id="content">
            <div id="players">
                <h2>Players</h2>
            </div>
            <div id="start-container">
                <button id="start">Start</button>
            </div>
        </div>
    `;
    document.body.appendChild(wrapper);

    socket.on("room-joined", (object) => {
      const players = document.getElementById('players');
      const player = document.createElement('div');
      player.setAttribute('class', 'player');
      player.innerHTML = `${object.userNames[object.userNames.length - 1]}`;
      players.appendChild(player);
      gameObject = object;
    });

    const startButton = document.getElementById('start');

    startButton.addEventListener('click', () => {
      socket.emit("start-game");
    });

  socket.on("start-drawing", (_) => {
    hostWaiting(gameObject);
  });

  socket.on("describe-drawing", (_) => {
    hostWaiting(gameObject);
  });

  socket.on("start-voting", (currentDrawings) => {
    let votingQueue = currentDrawings.slice();
    hostVoting(votingQueue);
  });

  socket.on("show-leaderboard", (scores) => {
    leaderboard(scores);
  });
}

function drawingSection(prompt)
{
    const theme = document.getElementById('theme')
    theme.href = './css/drawing-section.css';
    const oldWrapper = document.getElementById("wrapper");
    oldWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "wrapper";

    wrapper.innerHTML = `
        <div id="prompt-container">
            <div id="prompt">
                <p>${prompt}</p>
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
                <button id="submit-button">Submit</button>
            </div>
        </div>
    `;
    document.body.appendChild(wrapper);

    const canvas = document.getElementById('drawing-canvas');
    const inputs = document.getElementById('wrapper');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#fcf7ea';
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
            if(color == 'red')
            {
                ctx.strokeStyle = '#FF4040';
            }
            if(color == 'yellow')
            {
                ctx.strokeStyle = '#FFE240';
            }
            if(color.toLowerCase() == 'blue')
            {
                ctx.strokeStyle = '#4040FF';
            }
            if(color == 'green')
            {
                ctx.strokeStyle = '#A9FF40';
            }
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

        if(e.target.id == 'small')
        {
            lineWidth = 5;
        }

        if(e.target.id == 'medium')
        {
            lineWidth = 10;
        }

        if(e.target.id == 'large')
        {
            lineWidth = 30;
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
        const canvasRect = canvas.getBoundingClientRect();
        isPainting = true;
        startx = e.clientX - canvasRect.left;
        starty = e.clientY - canvasRect.top;
        ctx.moveTo(startx, starty);
    });

    canvas.addEventListener('mouseup', (e) => {
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
    });

    const draw = e => {
        if(!isPainting || confirmed) return;

        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';

        const canvasRect = canvas.getBoundingClientRect();
        const currentX = e.clientX - canvasRect.left;
        const currentY = e.clientY - canvasRect.top;

        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        lastX = currentX;
        lastY = currentY;
    }

    canvas.addEventListener('mousemove', draw);
    document.getElementById('submit-button').addEventListener('click', () => {
        const imageData = canvas.toDataURL('image/png');
        const imageObject = {
          user: username,
          guesses: [],
          img: imageData,
          correctDesc: prompt,
        };
        socket.emit("submit-drawing", imageObject);
        waiting();
        console.log(imageData);
    });
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
