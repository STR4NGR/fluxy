const Config = require('../models/Config');

async function initConfig() {
    try {
        let config = await Config.findOne();

        if (!config) {
            config = await Config.create({ shiftModificationHour: 11 });
            console.log('New config file created');
        } 
    } catch (err) {
        console.error('Config file error: ', err);
    }
}

module.exports = initConfig;