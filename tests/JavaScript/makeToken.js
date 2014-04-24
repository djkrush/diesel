var vows = require('vows'),
    assert = require('assert'),
    diesel = require('../../source/JavaScript/diesel.js').diesel;

vows.describe('When calling makeToken').addBatch({
    'With parameters': {
        topic: function () { return diesel.makeToken('TokenName', 'TokentText', 12, 21); },

        'it sets the specified name': function (topic) {
            assert.equal(topic.name, 'TokenName');
        },
        'it sets the specified text': function (topic) {
            assert.equal(topic.text, 'TokentText');
        },
        'it sets the specified lineNumber': function (topic) {
            assert.equal(topic.lineNumber, 12);
        },
        'it sets the specified position': function (topic) {
            assert.equal(topic.position, 21);
        }
    }
}).export(module);
