const file = getUserHome() + '/electron-quick-start-tutorial-030617.json'
const nconf = require('nconf').file({file});

const saveSettings = (settingKey, settingValue) => {
    nconf.set(settingKey, settingValue);
    nconf.save();
};

const readSettings = (settingKey) => {
    nconf.load();
    return nconf.get(settingKey);
};

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = {
    saveSettings,
    readSettings
};