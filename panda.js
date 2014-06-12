#!/usr/bin/env node
var colors = require('colors');
var argm = process.argv[2];
var command;

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
    // file: [desc, alias1, alias2, alias3...]
    build: ['Build your game', 'build', 'minify', 'b'],
    server: ['Start web server', 'server', 'start', 's'],
    cache: ['Create cache manifest', 'cache', 'offline', 'c'],
    check: ['Check code style', 'check', 'lint', 'valid', 'jscs', 'test', 'l'],
    install: ['Install Panda.js', 'install', 'i']
};

// Parse command from arguments
for (var i in global.commands) {
    for (var j = 1; j < global.commands[i].length; j++) {
        if (global.commands[i][j] === argm) command = i;
    }
    if (command) break;
}

// Default command
if (!command) command = 'help';

require('./' + command + '.js');
