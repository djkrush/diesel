var vows = require('vows'),
    assert = require('assert'),
    diesel = require('../../source/JavaScript/diesel.js').diesel;

vows.describe('When calling makeNewLineTableEntry').addBatch({
    'It should': {
        topic: function () { return diesel.makeNewLineTableEntry(); },

        'return newLine as the name': function (topic) {
            assert.equal(topic.tokenName, 'newLine');
        },
        'return an expression that matches line feed': function (topic) {
            assert.equal(topic.expression.test('\r\n'), true);
        },
        'return an expression that matches carraige return and line feed': function (topic) {
            assert.equal(topic.expression.test('\n'), true);
        },
        'return an expression that does not match a carraige return without a line feed': function (topic) {
            assert.equal(topic.expression.test('\r'), false);
        }
    }
}).export(module);
