module.exports = exports = function(dir, callback, arguments) {
    console.log('Building project...');

    if (!dir) return callback('Directory not set');

    var UglifyJS = require('uglify-js');
    var fs = require('fs');

    try {
        var pandaCore = require(dir + '/src/engine/core.js');
    }
    catch (e) {
        return callback('Engine not found');
    }

    var target = arguments[0] || 'game';
    var header = '// Made with Panda Engine ' + pandaCore.version + ' - http://www.pandajs.net\n';
    var outputFile = target === 'core' ? 'panda.min.js' : 'game.min.js';

    var config;
    
    global.game = {
        curDir: '',
        modules: [],

        config: function(config) {
            this.config = config;
        },

        module: function(name) {
            if (this.config.ignoreModules && this.config.ignoreModules.indexOf(name) !== -1) {
                return this;
            }

            name = name.replace(/\./g, '/') + '.js';
            if (this.modules.indexOf(name) === -1) this.modules.unshift(name);
            return this;
        },

        require: function() {
            var i, name, modules = Array.prototype.slice.call(arguments);
            for (i = 0; i < modules.length; i++) {
                if (this.config.ignoreModules.indexOf(modules[i]) !== -1) continue;
                name = modules[i].replace(/\./g, '/') + '.js';
                if (this.modules.indexOf(name) === -1) {
                    this.modules.unshift(name);
                    require(dir + '/src/' + name);
                }
            }
            return game;
        },

        body: function() {}
    };

    // Read game files
    var gameFiles = fs.readdirSync(dir + '/src/game/');

    // Parse game files
    game.curDir = 'game';
    for (var i = 0; i < gameFiles.length; i++) {
        require(dir + '/src/game/' + gameFiles[i]);
    }

    if (target === 'core') game.modules.length = 0;

    // Clean config
    delete game.config.debug;
    delete game.config.debugDraw;
    delete game.config.name;
    delete game.config.version;
    game.config.ignoreModules = game.config.ignoreModules || [];
    
    // Skip debug module
    if (game.config.ignoreModules.indexOf('engine.debug') === -1) {
        game.config.ignoreModules.push('engine.debug');
    }

    if (target === 'core') game.config.ignoreModules.length = 0;

    // Parse engine files
    game.curDir = 'engine';
    for (var i = 0; i < pandaCore._coreModules.length; i++) {
        var file = pandaCore._coreModules[i].replace(/\./g, '/');
        require(dir + '/src/' + file);
    }

    // Include core module
    game.modules.unshift('engine/core.js');

    // Include dir in modules
    for (var i = 0; i < game.modules.length; i++) {
        game.modules[i] = dir + '/src/' + game.modules[i];
    }

    console.log(game.modules);

    // Minify
    var result = UglifyJS.minify(game.modules);
    var output = result.code;

    // Include header
    if (target === 'game') output = header + output;

    // Write output file
    fs.writeFile(dir + '/' + outputFile, output, function(err) {
        if (err) {
            callback('Error writing file ' + outputFile);
        }
        else {
            var size = fs.statSync(dir + '/' + outputFile).size;
            var percent = Math.round((size / totalSize) * 100);
            console.log('Saved ' + outputFile + ' ' + size + ' bytes (' + percent + '%)');
            callback();
        }
    });

    return;
    var i, file, size, output, totalSize = 0;
    
    var configFile = 'src/game/config.js';
    
    var defaultModules = false;
    var target = arguments[0] || 'game';
    var outputFile = target === 'core' ? 'panda.min.js' : 'game.min.js';
    var ignoreModules = [];
    var filesToMinify = [];

    // Read game files
    var gameFiles = fs.readdirSync(dir + '/src/game/');

    var srcDir = dir + '/src/';

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
            if (ignoreModules.indexOf(modules[i]) !== -1) continue;
            name = modules[i].replace(/\./g, '/') + '.js';
            if (game.modules.indexOf(name) === -1) {
                game.modules.push(name);
                require(srcDir + name);
            }
        }
        return game;
    };
    game.body = function() {};

    // Ignore debug module
    var coreVersion = parseFloat(pandaCore.version);
    if (coreVersion >= 1.14 && target !== 'core') {
        var debugIndex = ignoreModules.indexOf('engine.debug');
        if (debugIndex === -1) ignoreModules.push('engine.debug');
    }

    // Remove ignored modules
    for (var i = 0; i < ignoreModules.length; i++) {
        var index = game.coreModules.indexOf(ignoreModules[i]);
        if (index !== -1) game.coreModules.splice(index, 1);
    }

    // Read core modules
    for (var i = 0; i < game.coreModules.length; i++) {
        game.module(game.coreModules[i]);
    }

    // Process main game module
    if (target === 'game') {
        var gameMainModule = pandaConfig.gameMainModule || 'main';
        require(srcDir + 'game/' + gameMainModule + '.js');
    }

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
    var result = UglifyJS.minify(game.modules);

    // Include header
    if (target === 'core') output = '// Panda Engine ' + pandaCore.version + ' - http://www.pandajs.net\n';
    else output = header + '\n';

    // Clean config
    // delete pandaConfig.debug;
    // delete pandaConfig.debugDraw;
    // delete pandaConfig.name;
    // delete pandaConfig.version;

    // Include config
    if (target !== 'core') output += 'pandaConfig=' + JSON.stringify(pandaConfig) + ';';

    // Include sitelock function
    // if (pandaConfig.sitelock) {
    //     var secret = 0;
    //     for (i = 0; i < pandaConfig.sitelock.length; i++) {
    //         secret += pandaConfig.sitelock[i].charCodeAt(0);
    //     }
    //     var sitelockFunc = 'var s=' + secret + ',h=0,n=location.hostname;for(var i=0;i<n.length;i++)h+=n[i].charCodeAt(0);if (s!==h)throw 0;';
    //     output += sitelockFunc;
    // }

    // Include minified code
    output += result;

    // Include build number
    if (target !== 'core') output += 'game.build=' + Date.now() + ';';

    // Write output file
    fs.writeFile(dir + '/' + outputFile, output, function(err) {
        if (err) {
            callback('Error writing file ' + outputFile);
        }
        else {
            var size = fs.statSync(dir + '/' + outputFile).size;
            var percent = Math.round((size / totalSize) * 100);
            console.log('Saved ' + outputFile + ' ' + size + ' bytes (' + percent + '%)');
            callback();
        }
    });
};
