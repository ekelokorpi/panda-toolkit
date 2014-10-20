var UglifyJS = require('uglify-js');
var fs = require('fs');
var i, file, size, result, output, totalSize = 0;
var configFile = process.argv[3] || 'src/game/config.js';
var header = '// Made with Panda.js - http://www.pandajs.net';
var sourceFolder = 'src';
var outputFile = 'game.min.js';

console.log('Building...'.title);

// Read config file
try {
    require(process.cwd() + '/' + configFile);
    console.log('Using config ' + configFile.file);
    if (pandaConfig.sourceFolder) {
        sourceFolder = pandaConfig.sourceFolder;
        delete pandaConfig.sourceFolder;
    }
    if (pandaConfig.outputFile) {
        outputFile = pandaConfig.outputFile;
        delete pandaConfig.outputFile;
    }
} catch (e) {
    // Load default config
    console.log('Using default config');
}

var dir = process.cwd() + '/' + sourceFolder + '/';

// Disable debug mode
if (pandaConfig.debug) delete pandaConfig.debug.enabled;

global['game'] = {};
game.modules = ['engine/core.js'];
game.coreModules = [];
game.module = function(name) {
    name = name.replace(/\./g, '/') + '.js';
    if (game.modules.indexOf(name) === -1) game.modules.push(name);
    return game;
};
game.require = function() {
    var i, name, modules = Array.prototype.slice.call(arguments);
    for (i = 0; i < modules.length; i++) {
        if (pandaConfig.ignoreModules.indexOf(modules[i]) !== -1) continue;
        name = modules[i].replace(/\./g, '/') + '.js';
        if (game.modules.indexOf(name) === -1) {
            game.modules.push(name);
            require(dir + name);
        }
    }
    return game;
};
game.body = function() {};

// Get core modules
pandaConfig.ignoreModules = pandaConfig.ignoreModules || [];
var pandaCore = require(dir + 'engine/core.js');
if (pandaConfig.coreModules) game.coreModules = pandaConfig.coreModules;
else game.coreModules = pandaCore.coreModules;
for (var i = 0; i < game.coreModules.length; i++) {
    game.module(game.coreModules[i]);
}

// Process main game module
require(dir + 'game/main.js');
delete pandaConfig.ignoreModules;

// Include dir to modules
for (i = 0; i < game.modules.length; i++) {
    file = game.modules[i];
    game.modules[i] = dir + file;
    size = fs.statSync(game.modules[i]).size;
    totalSize += size;
    console.log(file.file + ' ' + (size.toString()).number + ' bytes');
}
console.log('Total ' + (totalSize.toString()).number + ' bytes');

// Minify
result = UglifyJS.minify(game.modules);

// Include header
output = header + '\n';

// Include config
output += 'pandaConfig=' + JSON.stringify(pandaConfig) + ';';

// Include sitelock function
if (pandaConfig.sitelock) {
    var secret = 0;
    for (i = 0; i < pandaConfig.sitelock.length; i++) {
        secret += pandaConfig.sitelock[i].charCodeAt(0);
    }
    var sitelockFunc = 'var s=' + secret + ',h=0,n=location.hostname;for(var i=0;i<n.length;i++)h+=n[i].charCodeAt(0);if (s!==h)throw 0;';
    output += sitelockFunc;
}

// Include minified code
output += result.code.replace('"use strict";', '');

// Include build number
output += 'game.build=' + Date.now() + ';';

// Write output file
fs.writeFile(outputFile, output, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        var size = fs.statSync(outputFile).size;
        var percent = Math.round((size / totalSize) * 100);
        console.log('Saved ' + outputFile.file + ' ' + (size.toString()).number + ' bytes (' + percent + '%)');
    }
});
