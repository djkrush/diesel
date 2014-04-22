CodeMirror.defineMode("sql", function (config, parserConfig) {
	isTokenKeyword = function (tokenKeyName) {
		var result = false;

		if (tokenKeyName.indexOf("Keyword") !== -1) {
			result = true;
		}

		return result;
	};

	isTokenLiteral = function (tokenKeyName) {
		var result = false;

		if (tokenKeyName.indexOf("Literal") !== -1) {
			result = true;
		}

		return result;
	};

	return {
		language: dsl.sql.language,
        token: function (stream) {
        	var result = null,
                dslTokens = dsl.sql.tokens.dictionary,
				isKeyword = false,
				isLiteral = false,
                tokenExpression = null,
				matchedToken = false;
                

            for (var tokenKeyName in dslTokens) {
            	if (dslTokens.hasOwnProperty(tokenKeyName)) {
            		tokenExpression = dslTokens[tokenKeyName].expression;

            		if (stream.match(tokenExpression, true)) {
            			matchedToken = true;
            			isKeyword = isTokenKeyword(tokenKeyName);
            			isLiteral = isTokenLiteral(tokenKeyName);
            			break;
            		}
            	}
            }

            if (matchedToken && isKeyword) {
            	result = 'dsl-keyword';
            }
            else if (matchedToken && isLiteral) {
            	result = 'dsl-literal';
            }
            else if (matchedToken) {
            	result = 'dsl-text';
            }
            else if(stream.eatSpace() == false) {
            	stream.skipToEnd();
            	result = 'dsl-error';
            }

            return result;
        }
    };
});

CodeMirror.defineMIME("sql", "sql");
