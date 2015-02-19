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

var ksort = function(obj) {
    var keys = [], result = {}, i;
    for (i in obj) {
        keys.push(i);
    }
    
    keys.sort();
    for (i = 0; i < keys.length; i++) {
        result[keys[i]] = obj[keys[i]];
    }

    return result;
};

var commands = {
    // file: [desc, alias1, alias2, alias3...]
    build: ['Build project', 'build', 'minify', 'b'],
    // server: ['Start web server', 'server', 'start', 's'],
    // cache: ['Create cache manifest', 'cache', 'offline', 'c'],
    // check: ['Check code style', 'check', 'lint', 'valid', 'jscs', 'test', 'l'],
    // update: ['Update engine', 'update', 'u'],
    // version: ['Version control', 'version', 'v'],
    // compress: ['Compress image files', 'compress', 'tinypng'],
    create: ['Create new project', 'create', 'install']
};

var help = function() {
    var data = require('./package.json');

    console.log(data.description.title + ' ' + ('v' + data.version).number);
    console.log('');
    console.log('Usage: ' + 'panda'.command + ' ' + '[command]'.parameter);
    console.log('');
    console.log('Commands:');
    for (var i in commands) {
        console.log('       ' + commands[i][1].command + '\t' + commands[i][0].grey);
    }
    console.log('');
};

commands = ksort(commands);

// Parse command from arguments
for (var i in commands) {
    for (var j = 1; j < commands[i].length; j++) {
        if (commands[i][j] === argm) command = i;
    }
    if (command) break;
}

// Default command
if (!command) return help();

command = require('./' + command);
command(process.argv[3], process.argv[4], function(err) {
    if (err) help();
});
