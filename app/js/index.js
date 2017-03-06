(function(){
    let {ipcRenderer} = require('electron');
    ipcRenderer.send('async-data', 1);
    let closeBtn = document.querySelector('#utility-close');
    closeBtn.addEventListener('click', function(){
        const kill = ipcRenderer.send('close-main-window');
    });

    let saveSettingsBtn = document.querySelector('#utility-save');
    saveSettingsBtn.addEventListener('click', function() {
        let new_setting = document.querySelector('#utility-shortcut').value;
        new_setting = parseInt(new_setting);
        if(typeof new_setting == 'number') {
            //update in conf + update shorcuts in app
            ipcRenderer.send('update-shortcut-key1', new_setting);
        }
    });



    const container = document.querySelector('#music-buttons');

    const buttons_container = document.createElement('div');
    buttons_container.className = 'buttons';
    container.appendChild(buttons_container);
    console.log('index.html is located at -> ', __dirname);
    //stole btn code from tutorial
    const prepareButton = (btn) => {
        const soundName = btn.dataset.sound;
        btn.querySelector('span').style.backgroundImage = `url('./app/img/${soundName}.png')`;

        let audio = new Audio(`./app/wav/${soundName}.wav`);
        btn.addEventListener('click', function(){
            audio.currenTime = 0;
            audio.play();
        });
        return btn;
    };

    let sounds = ['ba-dum-tsss', 'money', 'ba-dum-tsss', 'money', 'burp', 'sad-trombone', 'applause', 'crowd-laughing'];
    sounds = sounds.map(s => {
        let btn = document.createElement('div');
        btn.className = 'button-sound';
        btn.setAttribute('data-sound', s);
        const icon = document.createElement('span');
        icon.className = 'button-icon';
        btn.appendChild(icon);
        // btn = prepareButton(btn);
        const soundName = btn.dataset.sound;
        btn.querySelector('span').style.backgroundImage = `url('./app/img/${soundName}.png')`;

        let audio = new Audio(`./app/wav/${soundName}.wav`);
        btn.addEventListener('click', function(){
            audio.currenTime = 0;
            audio.play();
        });
        return btn;
    });
    console.log(sounds);
    sounds.forEach(div => buttons_container.appendChild(div));

    ipcRenderer.on('global-shortcut', () => {
        let event = new MouseEvent('click');
        const max = sounds.length;
        const i = parseInt(max * Math.random());
        sounds[(i > 1) ? i - 1: 0].dispatchEvent(event);
    });
})();