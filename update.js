var update = function(dir, callback, params) {
    console.log('Updating engine...');

    if (!dir) return callback('Directory not set');

    var fs = require('fs');
    var mv = require('mv');
    var download = require('download');
    var path = require('path');

    // Settings
    var tempDir = path.join(dir, '.panda');
    var devMode = (params[0] === 'dev');
    var url = 'https://github.com/ekelokorpi/panda-engine/archive/' + (devMode ? 'develop' : 'master') + '.zip';

    if (devMode) console.log('(develop version)');

    rmdir(tempDir);

    function moveFiles() {
        var from = path.join(tempDir, '/src/engine');
        var to = path.join(dir, '/src/engine');

        rmdir(to);

        mv(from, to, { mkdirp: true }, function(err) {
            if (err) return callback('Error moving files');

            rmdir(tempDir);
            callback();
        });
    };

    function rmdir(dir) {
        try {
            var files = fs.readdirSync(dir);
        }
        catch (e) {
            return;
        }
        
        for (var i = 0; i < files.length; i++) {
            var filename = path.join(dir, files[i]);
            var stat = fs.statSync(filename);
            
            if (stat.isDirectory()) rmdir(filename);
            else fs.unlinkSync(filename);
        }
        fs.rmdirSync(dir);
    };

    fs.stat(path.join(dir, 'src/engine'), function(err) {
        if (err) return callback('Not valid project folder');

        fs.mkdir(tempDir, function(err) {
            if (err) return callback('Error creating temp folder');

            var wget = download(url, tempDir, { extract: true, strip: 1 });

            wget.on('error', function(err) {
                if (err) return callback('Error downloading update');
            });

            wget.on('close', function() {
                moveFiles();
            });
        });
    });
};

module.exports = exports = update;
