#!/usr/bin/env node

var colors = require('colors');
colors.setTheme({
    url: 'green',
    file: 'magenta',
    number: 'cyan',
    title: 'yellow',
    error: 'red',
    command: 'magenta',
    parameter: 'grey'
});

if(process.argv[2] === 'build') return require('./build.js');
if(process.argv[2] === 'server') return require('./server.js');
if(process.argv[2] === 'offline') return require('./offline.js');
if(process.argv[2] === 'version') {
    var data = require('./package.json');
    return console.log(data.version.number);
}

var data = require('./package.json');
console.log(data.description.title + ' ' + data.version.number);
console.log('');
console.log('Usage: ' + 'panda'.command + ' ' + '[command]'.parameter);
console.log('');
console.log('Commands: ' + 'build'.command + ', ' + 'offline'.command + ', ' + 'server'.command);
console.log('');