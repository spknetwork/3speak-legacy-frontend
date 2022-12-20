var express = require('express');
var router = express.Router();
const fetch = require('node-fetch')
const requireLogin = require('./middleware/requireLogin');
const {mongo, admins} = require('../helper')
const mssql = require('mssql');
const numeral = require('numeral');
const steem = require('steem');
steem.api.setOptions({useAppbaseApi: true, url: `${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}/`});




module.exports = router;
