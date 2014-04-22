(function (dsl, undefined) {
    (function (sql) {
        (function (tokens) {
            var dictionary,
                expressionTable;

            dictionary = {
                selectKeyword: {
                    name: 'SELECT',
                    expression: /^\bSelect\b/i
                },
                insertKeyword: {
                    name: 'INSERT',
                    expression: /^\bInsert\b/i
                },
                updateKeyword: {
                    name: 'UPDATE',
                    expression: /^\bUpdate\b/i
                },
                deleteKeyword: {
                    name: 'DELETE',
                    expression: /^\bDelete\b/i
                },
                fromKeyword: {
                    name: 'FROM',
                    expression: /^\bFrom\b/i
                },
                whereKeyword: {
                    name: 'WHERE',
                    expression: /^\bWhere\b/i
                },
                setKeyword: {
                    name: 'SELECT',
                    expression: /^\bSet\b/i
                },
                intoKeyword: {
                    name: 'INTO',
                    expression: /^\bInto\b/i
                },
                valuesKeyword: {
                    name: 'VALUES',
                    expression: /^\bValues\b/i
                },
                andKeyword: {
                    name: 'AND',
                    expression: /^\bAnd\b/i
                },
                orKeyword: {
                    name: 'OR',
                    expression: /^\bOr\b/i
                },
                openParenthesisKeyword: {
                    name: '(',
                    expression: /^\(/
                },
                closeParenthesisKeyword: {
                    name: ')',
                    expression: /^\)/
                },
                commaKeyword: {
                    name: ',',
                    expression: /^\,/
                },
                periodKeyword: {
                    name: '.',
                    expression: /^\./
                },
                sqlIdentifierLiteral: {
                    name: 'SQL Identifier',
                    expression: /^\[[^\]]+\]/
                },
                sqlStringLiteral: {
                    name: 'SQL String',
                    expression: /^'[^']*'/
                },
                numericLiteral: {
                    name: 'Numeric Literal',
                    expression: /^(?:\d{1,3}(?:\d{1,15}|(?:,\d{3}){1,5})?(?:\.\d{1,6}|\.)?|(?:\.\d{1,6}))(?!\d*%)(?!\d*\.\d*%)/
                }
            };
            tokens.dictionary = dictionary;

            expressionTable = [
                diesel.makeTableEntry(dictionary.selectKeyword.name, dictionary.selectKeyword.expression),
                diesel.makeTableEntry(dictionary.insertKeyword.name, dictionary.insertKeyword.expression),
                diesel.makeTableEntry(dictionary.updateKeyword.name, dictionary.updateKeyword.expression),
                diesel.makeTableEntry(dictionary.deleteKeyword.name, dictionary.deleteKeyword.expression),
                diesel.makeTableEntry(dictionary.fromKeyword.name, dictionary.fromKeyword.expression),
                diesel.makeTableEntry(dictionary.whereKeyword.name, dictionary.whereKeyword.expression),
                diesel.makeTableEntry(dictionary.setKeyword.name, dictionary.setKeyword.expression),
                diesel.makeTableEntry(dictionary.intoKeyword.name, dictionary.intoKeyword.expression),
                diesel.makeTableEntry(dictionary.valuesKeyword.name, dictionary.valuesKeyword.expression),
                diesel.makeTableEntry(dictionary.andKeyword.name, dictionary.andKeyword.expression),
                diesel.makeTableEntry(dictionary.orKeyword.name, dictionary.orKeyword.expression),
                diesel.makeTableEntry(dictionary.openParenthesisKeyword.name, dictionary.openParenthesisKeyword.expression),
                diesel.makeTableEntry(dictionary.closeParenthesisKeyword.name, dictionary.closeParenthesisKeyword.expression),
                diesel.makeTableEntry(dictionary.periodKeyword.name, dictionary.periodKeyword.expression),
                diesel.makeTableEntry(dictionary.commaKeyword.name, dictionary.commaKeyword.expression),
                diesel.makeTableEntry(dictionary.sqlIdentifierLiteral.name, dictionary.sqlIdentifierLiteral.expression),
                diesel.makeTableEntry(dictionary.sqlStringLiteral.name, dictionary.sqlStringLiteral.expression),
                diesel.makeTableEntry(dictionary.numericLiteral.name, dictionary.numericLiteral.expression),
                diesel.makeNewLineTableEntry()
            ];

            tokens.lexer = diesel.makeLexer(expressionTable, undefined);
        }(sql.tokens = sql.tokens || { }));
    }(dsl.sql = dsl.sql || { }));
}(this.dsl = this.dsl || { }));
