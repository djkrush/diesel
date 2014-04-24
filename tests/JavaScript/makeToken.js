var vows = require('vows'),
    assert = require('assert'),
    diesel = require('../../source/JavaScript/diesel.js').diesel;

vows.describe('When calling makeToken').addBatch({
    'It should': {
        topic: function () { return diesel.makeToken('TokenName', 'TokentText', 12, 21); },

        'set the name': function (topic) {
            assert.equal(topic.name, 'TokenName');
        },
        'set the text': function (topic) {
            assert.equal(topic.text, 'TokentText');
        },
        'set the lineNumber': function (topic) {
            assert.equal(topic.lineNumber, 12);
        },
        'set the position': function (topic) {
            assert.equal(topic.position, 21);
        }
    }
}).export(module);
