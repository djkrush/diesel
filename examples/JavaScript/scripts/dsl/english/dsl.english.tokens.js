(function (dsl, undefined) {
    (function (english) {
        (function (tokens) {
            var dictionary,
                expressionTable;

            dictionary = {
                theKeyword: {
                    name: 'The',
                    expression: /^\bThe\b/i
                },
                aKeyword: {
                    name: 'A',
                    expression: /^\bA\b/i
                },
                tallKeyword: {
                    name: 'Tall',
                    expression: /^\bTall\b/i
                },
                smartKeyword: {
                    name: 'Smart',
                    expression: /^\bSmart\b/i
                },
                boyKeyword: {
                    name: 'Boy',
                    expression: /^\bBoy\b/i
                },
                girlKeyword: {
                    name: 'Girl',
                    expression: /^\bGirl\b/i
                },
                jumpedKeyword: {
                    name: 'Jumped',
                    expression: /^\bJumped\b/i
                },
                skippedKeyword: {
                    name: 'Skipped',
                    expression: /^\bSkipped\b/i
                },
                adverbLiteral: {
                    name: 'Adverb',
                    expression: /^\b[\w]+ly\b/i
                },
                periodKeyword: {
                    name: '.',
                    expression: /^\./
                },
                exclamationPointKeyword: {
                    name: '!',
                    expression: /^!/
                },
                questionMarkKeyword: {
                    name: '?',
                    expression: /^\?/
                }
            };
            tokens.dictionary = dictionary;

            expressionTable = [
                diesel.makeTableEntry(dictionary.theKeyword.name, dictionary.theKeyword.expression),
                diesel.makeTableEntry(dictionary.aKeyword.name, dictionary.aKeyword.expression),
                diesel.makeTableEntry(dictionary.tallKeyword.name, dictionary.tallKeyword.expression),
                diesel.makeTableEntry(dictionary.smartKeyword.name, dictionary.smartKeyword.expression),
                diesel.makeTableEntry(dictionary.boyKeyword.name, dictionary.boyKeyword.expression),
                diesel.makeTableEntry(dictionary.girlKeyword.name, dictionary.girlKeyword.expression),
                diesel.makeTableEntry(dictionary.jumpedKeyword.name, dictionary.jumpedKeyword.expression),
                diesel.makeTableEntry(dictionary.skippedKeyword.name, dictionary.skippedKeyword.expression),
                diesel.makeTableEntry(dictionary.adverbLiteral.name, dictionary.adverbLiteral.expression),
                diesel.makeTableEntry(dictionary.periodKeyword.name, dictionary.periodKeyword.expression),
                diesel.makeTableEntry(dictionary.exclamationPointKeyword.name, dictionary.exclamationPointKeyword.expression),
                diesel.makeTableEntry(dictionary.exclamationPointKeyword.name, dictionary.questionMarkKeyword.expression),
                diesel.makeTabTableEntry(),
                diesel.makeNewLineTableEntry()
            ];

            tokens.lexer = diesel.makeLexer(expressionTable, undefined);
        }(english.tokens = english.tokens || {}));
    }(dsl.english = dsl.english || {}));
}(this.dsl = this.dsl || { }));
