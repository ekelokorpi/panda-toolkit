var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(disallowEmptylineAfterComment) {
        assert(
            typeof disallowEmptylineAfterComment === 'boolean',
            'disallowEmptylineAfterComment option requires boolean value'
        );
        assert(
            disallowEmptylineAfterComment === true,
            'disallowEmptylineAfterComment option requires true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'disallowEmptylineAfterComment';
    },

    check: function(file, errors) {
        var lines = file.getLines();
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            var nextLine = lines[i + 1];
            if(line.charAt(0) === '/' || line.charAt(0) === '*') {
                if(typeof nextLine === 'string' && nextLine.trim() === '') {
                    errors.add('Illegal empty line after comment', i + 2, 0);
                }
            }
        }
    }

};
