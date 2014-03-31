#!/usr/bin/env node

var colors = require('colors');
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

global.commands = ['build', 'server', 'offline', 'test', 'debug'];
var command = commands.indexOf(process.argv[2]) !== -1 ? process.argv[2] : 'help';

require('./' + command + '.js');