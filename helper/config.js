const { config } = require("../config/index.js");
//const ini = require('ini');
//const fs = require('fs');

let configName = {
  host: config.dbHost,
  port: config.dbPort,
  wif: config.wif,
  wif_active: config.wifActive
};

/*
if (fs.existsSync(__dirname + '/config.ini')) {
  config = config = ini.parse(fs.readFileSync(__dirname + '/config.ini', 'utf-8'));
} else {
  config = config = ini.parse(fs.readFileSync(__dirname + '/config.example.ini', 'utf-8'));
}
*/

module.exports = configName;
