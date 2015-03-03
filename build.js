var build = function(dir, callback) {
    console.log('Building project...');

    if (!dir) return callback('Directory not set');

    var UglifyJS = require('uglify-js');
    var fs = require('fs');
    var i, file, size, result, output, totalSize = 0;
    var configFile = 'src/game/config.js';
    var header = '// Made with Panda.js - http://www.pandajs.net';
    var defaultModules = false;

    // Default config
    var sourceFolder = 'src';
    var outputFile = 'game.min.js';

    // Read config file
    try {
        require(dir + '/' + configFile);
        console.log('Using config ' + configFile);
        if (pandaConfig.sourceFolder) {
            sourceFolder = pandaConfig.sourceFolder;
            delete pandaConfig.sourceFolder;
        }
        if (pandaConfig.outputFile) {
            outputFile = pandaConfig.outputFile;
            delete pandaConfig.outputFile;
        }
    } catch (e) {
        return callback('Config file not found.');
    }

    var srcDir = dir + '/' + sourceFolder + '/';

    global['game'] = {};
    game.modules = ['engine/core.js'];
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
                require(srcDir + name);
            }
        }
        return game;
    };
    game.body = function() {};

    // Get core modules
    pandaConfig.ignoreModules = pandaConfig.ignoreModules || [];
    var pandaCore = require(srcDir + 'engine/core.js');
    game.coreModules = pandaCore._coreModules || pandaCore.coreModules;

    // Ignore debug module
    var coreVersion = parseFloat(pandaCore.version);
    if (coreVersion >= 1.14) {
        var debugIndex = pandaConfig.ignoreModules.indexOf('engine.debug');
        if (debugIndex === -1) pandaConfig.ignoreModules.push('engine.debug');
    }

    // Remove ignored modules
    for (var i = 0; i < pandaConfig.ignoreModules.length; i++) {
        var index = game.coreModules.indexOf(pandaConfig.ignoreModules[i]);
        if (index !== -1) game.coreModules.splice(index, 1);
    }

    // Read core modules
    for (var i = 0; i < game.coreModules.length; i++) {
        game.module(game.coreModules[i]);
    }

    // Process main game module
    var gameMainModule = pandaConfig.gameMainModule || 'main';
    require(srcDir + 'game/' + gameMainModule + '.js');

    // Include dir to modules
    for (i = 0; i < game.modules.length; i++) {
        file = game.modules[i];
        game.modules[i] = srcDir + file;
        size = fs.statSync(game.modules[i]).size;
        totalSize += size;
        console.log(file + ' ' + size + ' bytes');
    }
    console.log('Total ' + totalSize + ' bytes');

    // Minify
    result = UglifyJS.minify(game.modules);

    // Include header
    output = header + '\n';

    // Clean config
    delete pandaConfig.ignoreModules;
    delete pandaConfig.debug;
    delete pandaConfig.debugDraw;

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
    fs.writeFile(dir + '/' + outputFile, output, function(err) {
        if (err) {
            callback('Error writing file');
        }
        else {
            var size = fs.statSync(dir + '/' + outputFile).size;
            var percent = Math.round((size / totalSize) * 100);
            console.log('Saved ' + outputFile + ' ' + size + ' bytes (' + percent + '%)');
            callback();
        }
    });
};

module.exports = exports = build;
