var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(disallowNewlineAtFileEnd) {
        assert(
            typeof disallowNewlineAtFileEnd === 'boolean',
            'disallowNewlineAtFileEnd option requires boolean value'
        );
        assert(
            disallowNewlineAtFileEnd === true,
            'disallowNewlineAtFileEnd option requires true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'disallowNewlineAtFileEnd';
    },

    check: function(file, errors) {
        var lines = file.getLines();
        var lastLine = lines[lines.length - 1];

        if(lastLine.trim() === '') {
            errors.add('Illegal empty line at end of file', lines.length, 0);
        }
    }

};