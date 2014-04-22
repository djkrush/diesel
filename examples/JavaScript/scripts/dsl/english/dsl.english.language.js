(function (dsl, undefined) {
    (function (english) {
        (function (language) {
            var theKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.theKeyword.name, 'Article expected'),
                aKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.aKeyword.name, 'Article expected'),
                tallKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.tallKeyword.name, 'Adjective expected'),
                smartKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.smartKeyword.name, 'Adjective expected'),
                boyKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.boyKeyword.name, 'Noun expected'),
                girlKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.girlKeyword.name, 'Noun expected'),
                jumpedKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.jumpedKeyword.name, 'Verb expected'),
                skippedKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.skippedKeyword.name, 'Verb expected'),
                adverbLiteralCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.adverbLiteral.name, 'Adverb expected'),
                periodKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.periodKeyword.name, 'Punctuation expected'),
                exclamationPointKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.exclamationPointKeyword.name, 'Punctuation expected'),
                questionMarkKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.questionMarkKeyword.name, 'Punctuation expected'),
                nameLiteralCombinator = diesel.makeTerminalSymbolCombinator(dsl.english.tokens.dictionary.nameLiteral.name, 'Name expected'),

                buildAlternativeCombinatorAbstractSyntaxTree = function (alternativeCombinatorResult) {
                    return alternativeCombinatorResult.value;
                },
                articleCombinator = diesel.makeAlternativeCombinator(buildAlternativeCombinatorAbstractSyntaxTree, theKeywordCombinator, aKeywordCombinator),

                adjectiveCombinator = diesel.makeAlternativeCombinator(buildAlternativeCombinatorAbstractSyntaxTree, tallKeywordCombinator, smartKeywordCombinator),

                buildListCombinatorResult = function () {
                    var counter,
                    value,
                    listOfValues = [];

                    for (counter = 0; counter < arguments.length; counter++) {
                        value = arguments[counter].value.value;
                        listOfValues.push(value);
                    }

                    return listOfValues;
                },
                adjectiveListCombinator = diesel.makeKleeneStarCombinator(buildListCombinatorResult, adjectiveCombinator);
                nounCombinator = diesel.makeAlternativeCombinator(buildAlternativeCombinatorAbstractSyntaxTree, boyKeywordCombinator, girlKeywordCombinator),

                buildSubjectCombinatorAbstractSyntaxTree = function (articleCombinatorResult, adjectiveListCombinatorResult, nounCombinatorResult) {
                    return {
                        noun: nounCombinatorResult.value.value,
                        modifiers: adjectiveListCombinatorResult.value
                    }
                },
                subjectCombinator = diesel.makeSequenceCombinator(buildSubjectCombinatorAbstractSyntaxTree, articleCombinator, adjectiveListCombinator, nounCombinator),

                verbCombinator = diesel.makeAlternativeCombinator(buildAlternativeCombinatorAbstractSyntaxTree, jumpedKeywordCombinator, skippedKeywordCombinator),

                adverbListCombinator = diesel.makeKleeneStarCombinator(buildListCombinatorResult, adverbLiteralCombinator),

                buildPredicateCombinatorAbstractSyntaxTree = function (preAdverbListCombinatorResult, verbCombinatorResult, postAdverbListCombinatorResult) {
                    var counter,
                        value,
                        listOfModifiers = [];

                    for (counter = 0; counter < preAdverbListCombinatorResult.value.length; counter++) {
                        value = preAdverbListCombinatorResult.value[counter];
                        listOfModifiers.push(value);
                    }

                    for (counter = 0; counter < postAdverbListCombinatorResult.value.length; counter++) {
                        value = postAdverbListCombinatorResult.value[counter];
                        listOfModifiers.push(value);
                    }

                    return {
                        verb: verbCombinatorResult.value.value,
                        modifiers: listOfModifiers
                    }
                },
                predicateCombinator = diesel.makeSequenceCombinator(buildPredicateCombinatorAbstractSyntaxTree, adverbListCombinator, verbCombinator, adverbListCombinator),

                punctuationCombinator = diesel.makeAlternativeCombinator(buildAlternativeCombinatorAbstractSyntaxTree, periodKeywordCombinator, exclamationPointKeywordCombinator, questionMarkKeywordCombinator),

                buildSentenceAbstractSyntaxTree = function (subjectCombinatorResult, predicateCombinatorResult, punctuationCombinatorResult) {
                    return {
                        subject: subjectCombinatorResult.value,
                        predicate: predicateCombinatorResult.value,
                        punctuation: punctuationCombinatorResult.value.value
                    };
                },
                rootCombinator = diesel.makeSequenceCombinator(buildSentenceAbstractSyntaxTree, subjectCombinator, predicateCombinator, punctuationCombinator),
                parser = diesel.makeParser(rootCombinator),
                englishLanguage = diesel.makeDsl(dsl.english.tokens.lexer, parser);

            language.parse = function (input) {
                var result = englishLanguage.parse(input);

                return result;
            };
        }(english.language = english.language || { }));
    }(dsl.english = dsl.english || { }));
}(this.dsl = this.dsl || { }));
