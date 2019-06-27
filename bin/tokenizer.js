export function tokenize(strings, keys) {
    const cleanStrings = strings.map((s) => s.replace(/\s+/g, ''));
    let tokens = [];
    for (let i = 0; i < cleanStrings.length; i++) {
        const list = tokenizeString(cleanStrings[i], tokens);
        tokens = tokens.concat(list);
        if (i < keys.length) {
            const prevToken = tokens.length && tokens[tokens.length - 1];
            if (prevToken && (prevToken.type === 'literal' || prevToken.type === 'variable' || prevToken.type === 'rparen')) {
                tokens.push({ type: 'operator', value: '*' });
            }
            tokens.push({
                type: 'variable',
                value: keys[i]
            });
        }
    }
    // TODO parse negative numbers
    return tokens;
}
function bufferToNumber(buffer) {
    let bjoin = buffer.join('');
    if (bjoin === '.') {
        bjoin = '0';
    }
    return +bjoin;
}
function tokenizeString(s, fullList) {
    const result = [];
    const split = s.split('');
    let buffer = [];
    split.forEach((char) => {
        if (isDigit(char) || isDecimal(char)) {
            buffer.push(char);
        }
        else {
            if (buffer.length) {
                result.push({ type: 'literal', value: bufferToNumber(buffer) });
                buffer = [];
            }
            if (isOperator(char)) {
                let skip = false;
                if (char === '-') {
                    const prevToken = result.length ? result[result.length - 1] : (fullList.length ? fullList[fullList.length - 1] : null);
                    if ((!prevToken) || (prevToken.type === 'operator') || (prevToken.type === 'lparen')) {
                        skip = true;
                        buffer.push(char);
                    }
                }
                if (!skip) {
                    result.push({ type: 'operator', value: char });
                }
            }
            else if (isLeftParen(char)) {
                result.push({ type: 'lparen', value: char });
            }
            else if (isRightParen(char)) {
                result.push({ type: 'rparen', value: char });
            }
        }
    });
    if (buffer.length) {
        result.push({ type: 'literal', value: bufferToNumber(buffer) });
        buffer = [];
    }
    return result;
}
function isDecimal(ch) {
    return ch === '.';
}
function isDigit(ch) {
    return /\d/.test(ch);
}
function isOperator(ch) {
    return /\+|-|\*|\//.test(ch);
}
function isLeftParen(ch) {
    return ch === '(';
}
function isRightParen(ch) {
    return ch === ')';
}
