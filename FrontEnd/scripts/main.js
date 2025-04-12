
const playButton = document.getElementById('play-button');
const menuContent = document.getElementById('menu-content');

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

    mmButtons.appendChild(rulesBtn);
    mmButtons.appendChild(hostBtn);
    mmButtons.appendChild(joinBtn);

    menuContent.appendChild(mmButtons);
});