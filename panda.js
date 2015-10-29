#!/usr/bin/env node
var pandajs = require('./index');
var command = process.argv[2];

if (!pandajs[command]) command = 'help';

pandajs[command](process.cwd(), function(err) {
    if (err) console.log(err);
}, process.argv.splice(3));
