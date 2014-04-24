var vows = require('vows'),
    assert = require('assert'),
    diesel = require('../../source/JavaScript/diesel.js').diesel;

vows.describe('When calling makeTabTableEntry').addBatch({
    'It should': {
        topic: function () { return diesel.makeTabTableEntry(); },

        'return tab as the name': function (topic) {
            assert.equal(topic.tokenName, 'tab');
        },
        'return an expression that matches tabs': function (topic) {
            assert.equal(topic.expression.test('\t'), true);
        },
        'return an expression that does not match spaces': function (topic) {
            assert.equal(topic.expression.test(' '), false);
        }
    }
}).export(module);
