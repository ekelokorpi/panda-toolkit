var fs = require('fs');
var download = require('download');
var path = require("path");

// Settings
var tempDir = '.panda';
var devMode = (process.argv[3] === 'dev');
var url = 'https://github.com/ekelokorpi/panda.js/archive/' + (devMode ? 'develop' : 'master') + '.zip';

console.log('Updating Panda.js engine...'.title);
if (devMode) console.log('(develop version)');

var filesToMove = [];

function moveFiles() {
    if (filesToMove.length === 0) {
        rmdir(tempDir);
        console.log('Done'.valid);
        return;
    }
    var file = filesToMove.shift();

    fs.rename(tempDir + '/src/engine/' + file, 'src/engine/' + file, function(err) {
        if (err) return console.log('Error moving file'.error);

        moveFiles();
    });
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

fs.stat('src/engine', function(err) {
    if (err) return console.log('Engine not found'.error);

    fs.mkdir(tempDir, function(err) {
        if (err) return console.log('Error creating temp dir'.error);

        var wget = download(url, tempDir, { extract: true, strip: 1 });

        wget.on('error', function(err) {
            if (err) return console.log('Error downloading update'.error);
        });

        wget.on('close', function() {
            fs.readdir(tempDir + '/src/engine', function(err, files) {
                if (err) return console.log('Error reading temp dir'.error);

                filesToMove = files;
                moveFiles();
            });
        });
    });
});
