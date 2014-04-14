var boilerplate = require('boilerplate');
var dir = process.argv[3] || '.';

console.log('Installing engine...'.title);

boilerplate.generate('http://github.com/ekelokorpi/panda.js', dir, function(err) {
    if (err) console.log(err.toString().error);
    else {
        console.log('Installed.'.green);
    }
});