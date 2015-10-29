var create = function(dir, callback, params) {
    if (!dir) return callback('Directory not set');
    var folder = params[0];
    if (!folder) return callback('Folder not set');
    console.log('Creating project ' + folder);

    var fs = require('fs');
    var download = require('download');
    var path = require('path');

    var tempDir = '.panda';
    var devMode = (params[1] === 'dev');
    var engineUrl = 'https://github.com/ekelokorpi/panda.js/archive/' + (devMode ? 'develop' : 'master') + '.zip';

    if (devMode) console.log('(develop version)');

    var engineFilesToMove = [
        'src/engine',
        'media',
        'src/game',
        'index.html'
    ];

    var tempPath = dir + '/' + tempDir;

    function moveEngineFiles() {
        if (engineFilesToMove.length === 0) {
            removeTempDir();
            callback();
            return;
        }
        var file = engineFilesToMove.shift();

        var from = dir + '/' + tempDir + '/' + file;
        var to = dir + '/' + folder + '/' + file;
        fs.rename(from, to, function(err) {
            if (err) {
                removeTempDir();
                return callback('Error moving file from ' + from + ' to ' + to);
            }

            moveEngineFiles();
        });
    };

    function removeTempDir() {
        rmdir(tempPath);
    };

    function rmdir(dir) {
        var files = fs.readdirSync(dir);
        for (var i = 0; i < files.length; i++) {
            var filename = path.join(dir, files[i]);
            var stat = fs.statSync(filename);
            
            if (stat.isDirectory()) rmdir(filename);
            else fs.unlinkSync(filename);
        }
        fs.rmdirSync(dir);
    };

    function createProject() {
        fs.mkdir(dir + '/' + folder + '/src', function(err) {
            if (err) {
                rmdir(dir + '/' + tempDir);
                return callback('Error creating src folder');
            }
            
            var wget = download(engineUrl, dir + '/' + tempDir, { extract: true, strip: 1 });

            wget.on('error', function(err) {
                if (err) return callback('Error downloading engine');
            });

            wget.on('close', function() {
                moveEngineFiles();
            });
        });
    };

    function start() {
        fs.mkdir(tempPath, function(err) {
            if (err) return callback('Error creating temp folder at ' + tempPath);

            if (folder === '.') {
                createProject();
            }
            else {
                fs.mkdir(dir + '/' + folder, function(err) {
                    if (err) {
                        rmdir(dir + '/' + tempDir);
                        return callback('Error creating project folder');
                    }
                    else {
                        createProject();
                    }
                });
            }
        });
    };

    fs.readdir(dir + '/' + folder, function(err, files) {
        if (files && files.length > 0) callback('Project folder already exists');
        else start();
    });
};

module.exports = exports = create;
