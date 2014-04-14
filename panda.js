#!/usr/bin/env node
var colors = require('colors');
var argm = process.argv[2];
var file;

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

global.commands = {
    build: ['Build your game', 'build', 'minify', 'b'],
    server: ['Start web server', 'server', 'start','s'],
    cache: ['Create cache manifest', 'cache', 'offline', 'c'],
    jscs: ['Check code style', 'check', 'lint', 'valid', 'jscs', 'test', 'l'],
    install: ['Install Panda.js', 'install', 'i']
};

for (var i in global.commands) {
    for (var j = 1; j < global.commands[i].length; j++) {
        if(global.commands[i][j] === argm) file = i;
    }
    if(file) break;
}

if(!file) file = 'help';

require('./' + file + '.js');