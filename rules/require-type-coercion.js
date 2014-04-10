var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(requireTypeCoercion) {
        assert(
            typeof requireTypeCoercion === 'boolean',
            'requireTypeCoercion option requires boolean value'
        );
    },

    getOptionName: function() {
        return 'requireTypeCoercion';
    },

    check: function(file, errors) {
        file.iterateTokensByType('Punctuator', function(token, i, tokens) {
            if (token.value === '==' || token.value === '!=') {
                errors.add(
                    'Operator ' + token.value + ' should be ' + token.value + '=',
                    token.loc.start
                );
            }
        });
    }

};
