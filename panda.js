#!/usr/bin/env node
var pandajs = require('./index');
var colors = require('colors');
var command = process.argv[2];

colors.setTheme({
    url: 'yellow',
    file: 'yellow',
    number: 'cyan',
    title: 'magenta',
    command: 'yellow',
    parameter: 'grey',
    valid: 'green',
    error: 'red'
});

if (!command || !pandajs[command]) return pandajs.help();

pandajs[command](process.cwd(), {
    param: process.argv[3]
}, function(err) {
    if (err) console.log(err.error);
});
