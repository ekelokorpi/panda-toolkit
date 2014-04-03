var fs = require('fs');

var outputFile = process.argv[3] || 'game.cache';
var gameFile = process.argv[4] || 'game.min.js';
var mediaDir = process.argv[5] || 'media';
var ignoreFiles = ['.DS_Store'];

var readDir = function(dir, filesArray) {
    var files = fs.readdirSync(dir);
    for (var i = files.length - 1; i >= 0; i--) {
        if(fs.statSync(dir + '/' + files[i]).isDirectory()) {
            readDir(dir + '/' + files[i], filesArray);
        }
        else if(ignoreFiles.indexOf(files[i]) === -1) {
            filesArray.push(dir + '/' + files[i]);
        }
    }
};

var cacheFiles = [];
console.log('Building cache manifest...'.title);
cacheFiles.push(gameFile);
readDir(mediaDir, cacheFiles);
console.log('Total '+(cacheFiles.length.toString()).number+' files');

var output = 'CACHE MANIFEST' + '\n';
for (var i = 0; i < cacheFiles.length; i++) {
    output += cacheFiles[i] + '\n';
}

output += '\nNETWORK:\n*\n';

fs.writeFile(outputFile, output, function(err) {
    if(err) console.log(err);
    else {
        var size = fs.statSync(outputFile).size;
        console.log('Saved ' + outputFile.file + ' ' + (size.toString()).number + ' bytes');
    }
});