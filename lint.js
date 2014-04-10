var jshint = require('jshint').JSHINT;
var fs = require('fs');
var ignoreFiles = ['.DS_Store','.jshintrc'];
var totalErrors = 0;

var config = {
    'bitwise'       : false,    // Disallow bitwise operators (&, |, ^, etc.).
    'camelcase'     : true,     // Force all variable names to use either camelCase or UPPER_CASE.
    'curly'         : false,    // Require {} for every new block or scope.
    'eqeqeq'        : true,     // Require triple equals i.e. `===`.
    'es3'           : false,    // Enforce conforming to ECMAScript 3.
    'forin'         : false,    // Disallow `for in` loops without `hasOwnPrototype`.
    'immed'         : true,     // Require immediate invocations to be wrapped in parens e.g. `( function(){}() );`
    'indent'        : false,        // Require that 4 spaces are used for indentation.
    'latedef'       : true,     // Prohibit variable use before definition.
    'newcap'        : true,     // Require capitalization of all constructor functions e.g. `new F()`.
    'noarg'         : true,     // Prohibit use of `arguments.caller` and `arguments.callee`.
    'noempty'       : true,     // Prohibit use of empty blocks.
    'nonew'         : false,    // Prohibit use of constructors for side-effects.
    'plusplus'      : false,    // Disallow use of `++` & `--`.
    'quotmark'      : true,     // Force consistency when using quote marks.
    'undef'         : true,    // Require all non-global variables be declared before they are used.
    'unused'        : true,     // Warn when varaibles are created by not used.
    'strict'        : false,    // Require `use strict` pragma in every file.
    'trailing'      : true,     // Prohibit trailing whitespaces.
    'maxparams'     : 8,        // Prohibit having more than X number of params in a function.
    'maxdepth'      : 8,        // Prohibit nested blocks from going more than X levels deep.
    'maxstatements' : false,    // Restrict the number of statements in a function.
    'maxcomplexity' : false,    // Restrict the cyclomatic complexity of the code.
    'maxlen'        : false,    // Require that all lines are 100 characters or less.
    'asi'           : false,    // Tolerate Automatic Semicolon Insertion (no semicolons).
    'boss'          : true,     // Tolerate assignments inside if, for & while. Usually conditions & loops are for comparison, not assignments.
    'debug'         : false,    // Allow debugger statements e.g. browser breakpoints.
    'eqnull'        : false,    // Tolerate use of `== null`.
    'esnext'        : false,    // Allow ES.next specific features such as `const` and `let`.
    'evil'          : false,    // Tolerate use of `eval`.
    'expr'          : false,    // Tolerate `ExpressionStatement` as Programs.
    'funcscope'     : false,    // Tolerate declarations of variables inside of control structures while accessing them later from the outside.
    'globalstrict'  : false,    // Allow global 'use strict' (also enables 'strict').
    'iterator'      : false,    // Allow usage of __iterator__ property.
    'lastsemic'     : false,    // Tolerate missing semicolons when the it is omitted for the last statement in a one-line block.
    'laxbreak'      : false,    // Tolerate unsafe line breaks e.g. `return [\n] x` without semicolons.
    'laxcomma'      : false,    // Suppress warnings about comma-first coding style.
    'loopfunc'      : false,    // Allow functions to be defined within loops.
    'moz'           : false,    // Code that uses Mozilla JS extensions will set this to true
    'multistr'      : false,    // Tolerate multi-line strings.
    'proto'         : false,    // Tolerate __proto__ property. This property is deprecated.
    'scripturl'     : false,    // Tolerate script-targeted URLs.
    'smarttabs'     : false,    // Tolerate mixed tabs and spaces when the latter are used for alignmnent only.
    'shadow'        : false,    // Allows re-define variables later in code e.g. `var x=1; x=2;`.
    'sub'           : true,     // Tolerate all forms of subscript notation besides dot notation e.g. `dict['key']` instead of `dict.key`.
    'supernew'      : false,    // Tolerate `new function () { ... };` and `new Object;`.
    'validthis'     : false,    // Tolerate strict violations when the code is running in strict mode and you use this in a non-constructor function.
    'browser'       : true,     // Standard browser globals e.g. `window`, `document`.
    'couch'         : false,    // Enable globals exposed by CouchDB.
    'devel'         : false,    // Allow development statements e.g. `console.log();`.
    'dojo'          : false,    // Enable globals exposed by Dojo Toolkit.
    'jquery'        : false,    // Enable globals exposed by jQuery JavaScript library.
    'mootools'      : false,    // Enable globals exposed by MooTools JavaScript framework.
    'node'          : false,    // Enable globals available when code is running inside of the NodeJS runtime environment. (for Gruntfile)
    'nonstandard'   : false,    // Define non-standard but widely adopted globals such as escape and unescape.
    'prototypejs'   : false,    // Enable globals exposed by Prototype JavaScript framework.
    'rhino'         : false,    // Enable globals available when your code is running inside of the Rhino runtime environment.
    'worker'        : false,    // Enable globals available when your code is running as a WebWorker.
    'wsh'           : false,    // Enable globals available when your code is running as a script for the Windows Script Host.
    'yui'           : false,    // Enable globals exposed by YUI library.
    'nomen'         : false,    // Prohibit use of initial or trailing underbars in names.
    'onevar'        : false,    // Allow only one `var` statement per function.
    'passfail'      : false,    // Stop on first error.
    'white'         : false,    // Check against strict whitespace and indentation rules.
    'maxerr'        : 100       // Maximum errors before stopping.
};
var globals = {
    'module': false,
    'require': false,
    'PIXI': false,
    'spine': false,
    'chai': false,
    'describe': false,
    'it': false,
    'resemble': false,
    'game': false
};
var folder = process.argv[3] || 'src';
var fileQueue = [];
var filesReady = [];
fileQueue.push(folder);

var readFiles = function(callback) {
    var file = fileQueue.shift();
    if(!file) return callback();

    fs.stat(file, function(err, stats) {
        if(err) return console.log('Error reading '.error + file.file);
        if(stats.isDirectory()) {
            fs.readdir(file, function(err, files) {
                if(err) return console.log('Error reading '.error + file.file);
                for (var i = 0; i < files.length; i++) {
                    if(ignoreFiles.indexOf(files[i]) === -1) fileQueue.push(file + '/' + files[i]);
                }
                readFiles(callback);
            });
        } else {
            filesReady.push(file);
            readFiles(callback);
        }
    });
};

var validateFiles = function(callback) {
    var file = filesReady.shift();
    if(!file) return callback();

    fs.readFile(file, function(err, data) {
        if(!jshint(data.toString(), config, globals)) {
            var out = jshint.data();
            var errors = out.errors;
            console.log(file.file + ' ' + errors.length.toString().number + ' errors.'.error);
            totalErrors += errors.length;
        } else {
            console.log(file.file + ' valid!'.valid);
        }
        validateFiles(callback);
    });
};

console.log('Linting files..'.title);

readFiles(function() {
    validateFiles(function() {
        if(totalErrors > 0) console.log(('Total ' + totalErrors + ' errors.').error);
        else console.log('No errors found!'.valid);
    });
});