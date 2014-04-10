var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(disallowMultipleEmptyLines) {
        assert(
            typeof disallowMultipleEmptyLines === 'boolean',
            'disallowMultipleEmptyLines option requires boolean value'
        );
        assert(
            disallowMultipleEmptyLines === true,
            'disallowMultipleEmptyLines option requires true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'disallowMultipleEmptyLines';
    },

    check: function(file, errors) {
        var lines = file.getLines();
        for (var i = 1, l = lines.length; i < l; i++) {
            var line = lines[i];
            if (line.trim() === '' && lines[i - 1].trim() === '') {
                while (++i < l && lines[i] === '') {}
                errors.add('Multiple empty lines', i - 1, 0);
            }
        }
    }

};
