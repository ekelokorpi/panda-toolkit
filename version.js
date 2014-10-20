var fs = require('fs');
var configFile = process.argv[4] || 'src/game/config.js';
var configFilePath = process.cwd() + '/' + configFile;
var param = process.argv[3] || '';
var exec = require('child_process').exec;

try {
    require(configFilePath);
}
catch(e) {
    return console.log('Config file not found'.error);
}

if (typeof pandaConfig !== 'object') return console.log('Invalid config file'.error);

if (pandaConfig.version) {
    var version = pandaConfig.version.split('.');
    for (var i = 0; i < 3; i++) {
        version[i] = parseInt(version[i]) || 0;
    }
}
else {
    return console.log('No version found.'.error);
}

if (param.indexOf('major') !== -1) {
    version[0]++;
    version[1] = 0;
    version[2] = 0;
}
else if (param.indexOf('minor') !== -1) {
    version[1]++;
    version[2] = 0;
}
else if (param.indexOf('patch') !== -1) {
    version[2]++;
}
else {
    return console.log('Invalid parameter'.error);
}

var verStr = version.join('.');
console.log('Updating version...'.title);
console.log(pandaConfig.version.number + ' into ' + verStr.number);

// Update config.js
fs.readFile(configFilePath, { encoding: 'UTF-8' }, function (err, data) {
    if (err) return console.log('Error reading config file'.error);
    data = data.replace(pandaConfig.version, verStr);
    
    fs.writeFile(configFilePath, data, function (err) {
        if (err) return console.log('Error writing config file'.error);

        // Commit changes
        exec('git commit -a -m \'Updated version to ' + verStr + '\'', function (err, output) {
            if (err !== null) return console.log('Error commiting changes'.error);

            // Create new git tag
            exec('git tag -a ' + verStr + ' -m \'Updated version to ' + verStr + '\'', function (err, output) {
                if (err !== null) return console.log('Error creating version tag'.error);
                console.log('Updated.'.green);
            });
        });
    });
});
