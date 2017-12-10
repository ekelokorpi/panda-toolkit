module.exports = exports = function(dir, callback, arguments) {
    console.log('Building project...');
    arguments = arguments || [];
    
    if (!dir) return callback('Directory not set');

    var UglifyJS = require('uglify-js');
    var fs = require('fs');
    var path = require('path');
    var sourceFolder = arguments[1] || 'src';
    var outDir = arguments[2] || dir;

    try {
        var pandaCore = require(path.join(dir, sourceFolder, 'engine/core.js'));
    }
    catch (e) {
        return callback('Engine not found');
    }

    var target = arguments[0] || 'game';
    var header = '// Made with Panda 2 v' + pandaCore.version + ' - www.panda2.io\n';
    var outputFile = target === 'core' ? 'panda.min.js' : 'game.min.js';
    
    global.game = {
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
                    require(path.join(dir, sourceFolder, name));
                }
            }
            return game;
        },

        body: function() {}
    };

    // Read config
    require(path.join(dir, sourceFolder, 'game/config.js'));

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
    for (var i = 0; i < pandaCore._coreModules.length; i++) {
        var file = pandaCore._coreModules[i].replace(/\./g, '/');
        require(path.join(dir, sourceFolder, file));
    }

    // Include core module
    game.modules.unshift('engine/core.js');

    // Include dir in modules
    for (var i = 0; i < game.modules.length; i++) {
        game.modules[i] = path.join(dir, sourceFolder, game.modules[i]);
    }

    // Minify core
    var result = UglifyJS.minify(game.modules);
    var output = result.code;

    var minifyGameCode = function() {
        // Remove engine modules and include dir in game modules
        for (var i = game.modules.length - 1; i >= 0; i--) {
            if (game.modules[i].indexOf('engine/') === 0) {
                game.modules.splice(i, 1);
            }
            else {
                game.modules[i] = path.join(dir, sourceFolder, game.modules[i]);
            }
        }

        // Minify game code
        var result = UglifyJS.minify(game.modules);
        output += result.code;

        writeOutput();
    };

    var foldersToRead = [];
    var readGameFiles = function() {
        var folder = foldersToRead.pop();
        if (!folder) {
            minifyGameCode();
            return;
        }

        console.log('Reading folder ' + folder);

        // Read game files
        var gameFiles = fs.readdirSync(path.join(dir, sourceFolder, folder));
        console.log('Found ' + gameFiles.length + ' files');

        // Parse game files
        for (var i = 0; i < gameFiles.length; i++) {
            if (gameFiles[i].indexOf('.') === 0) continue;

            var file = path.join(dir, sourceFolder, folder, gameFiles[i]);

            var stats = fs.statSync(file);

            if (stats && stats.isDirectory()) {
                foldersToRead.push(path.join(folder, gameFiles[i]));
            }
            else {
                require(file);
            }
        }

        readGameFiles();
    };

    var writeOutput = function() {
        // Write output file
        fs.writeFile(path.join(outDir, outputFile), output, function(err) {
            if (err) {
                callback('Error writing file ' + outputFile);
            }
            else {
                console.log('Saved ' + outputFile);
                callback();
            }
        });
    };

    if (target === 'game') {
        // Include header
        output = header + output;

        // Include config
        output += 'game.config=' + JSON.stringify(game.config) + ';';

        game.modules.length = 0;

        foldersToRead.push('game');
        readGameFiles();
    }
    else {
        writeOutput();
    }
    
};
