var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(allowTrailingWhitespaceOnEmptyLines) {
        assert(
            typeof allowTrailingWhitespaceOnEmptyLines === 'boolean',
            'allowTrailingWhitespaceOnEmptyLines option requires boolean value'
        );
        assert(
            allowTrailingWhitespaceOnEmptyLines === true,
            'allowTrailingWhitespaceOnEmptyLines option requires true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'allowTrailingWhitespaceOnEmptyLines';
    },

    check: function(file, errors) {
        var lines = file.getLines();
        for (var i = 0, l = lines.length; i < l; i++) {
            if (lines[i].match(/\s$/) && lines[i].trim() !== '') {
                errors.add('Illegal trailing whitespace', i + 1, lines[i].length);
            }
        }
    }

};
