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
    var header = '// Made with Panda Engine ' + pandaCore.version + ' - www.pandajs.net\n';
    var outputFile = target === 'core' ? 'panda.min.js' : 'game.min.js';

    var config;
    
    global.game = {
        curDir: '',
        modules: [],

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

    // Read config
    game.config = require(dir + '/src/game/config.js');

    // Clean config
    delete game.config.debug;
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
    for (var i = 0; i < pandaCore.coreModules.length; i++) {
        var file = pandaCore.coreModules[i].replace(/\./g, '/');
        require(dir + '/src/' + file);
    }

    // Include core module
    game.modules.unshift('engine/core.js');

    // Include dir in modules
    for (var i = 0; i < game.modules.length; i++) {
        game.modules[i] = dir + '/src/' + game.modules[i];
    }

    // Minify core
    var result = UglifyJS.minify(game.modules);
    var output = result.code;

    if (target === 'game') {
        // Include header
        output = header + output;

        // Include config
        output += 'game.config=' + JSON.stringify(game.config) + ';';

        game.modules.length = 0;

        // Read game files
        var gameFiles = fs.readdirSync(dir + '/src/game/');

        // Parse game files
        game.curDir = 'game';
        for (var i = 0; i < gameFiles.length; i++) {
            require(dir + '/src/game/' + gameFiles[i]);
        }

        // Include dir in modules
        for (var i = 0; i < game.modules.length; i++) {
            game.modules[i] = dir + '/src/' + game.modules[i];
        }

        // Minify game code
        var result = UglifyJS.minify(game.modules);
        output += result.code;
    }

    // Write output file
    fs.writeFile(dir + '/' + outputFile, output, function(err) {
        if (err) {
            callback('Error writing file ' + outputFile);
        }
        else {
            console.log('Saved ' + outputFile);
            callback();
        }
    });
};
