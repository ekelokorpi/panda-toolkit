#!/usr/bin/env node
if(process.argv[2] === 'build') return require('./build.js');
if(process.argv[2] === 'server') return require('./server.js');

var data = require('./package.json');
console.log(data.description + ' ' + data.version);
console.log('Usage:');
console.log('   panda build [config]');
console.log('   panda server [port]');