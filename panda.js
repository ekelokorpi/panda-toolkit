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

if(process.argv[2] === 'build') return require('./build.js');
if(process.argv[2] === 'server') return require('./server.js');
if(process.argv[2] === 'offline') return require('./offline.js');
if(process.argv[2] === 'test') return require('./test.js');
if(process.argv[2] === 'debug') return require('./debug.js');

var data = require('./package.json');

console.log(data.description.title + ' ' + data.version.number);
if(process.argv[2] === 'version') return;

console.log('');
console.log('Usage: ' + 'panda'.command + ' ' + '[command]'.parameter);
console.log('');
console.log('Commands: ' + 'build'.command + ', ' + 'offline'.command + ', ' + 'server'.command);
console.log('');