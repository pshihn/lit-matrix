import { Matrix } from './matrix';

type TokenType = 'literal' | 'variable' | 'operator' | 'rparen' | 'lparen';

export interface Token {
  type: TokenType;
  value: string | number | Matrix;
}

export function tokenize(strings: string[], keys: (number | Matrix)[]): Token[] {
  const cleanStrings = strings.map((s) => s.replace(/\s+/g, ''));
  let tokens: Token[] = [];
  for (let i = 0; i < cleanStrings.length; i++) {
    const list = tokenizeString(cleanStrings[i]);
    tokens = tokens.concat(list);
    if (i < keys.length) {
      tokens.push({
        type: 'variable',
        value: keys[i]
      });
    }
  }
  // TODO parse negative numbers
  return tokens;
}

function bufferToNumber(buffer: string[]): number {
  let bjoin = buffer.join('');
  if (bjoin === '.') {
    bjoin = '0';
  }
  return +bjoin;
}

function tokenizeString(s: string): Token[] {
  const result: Token[] = [];
  const split = s.split('');
  let buffer: string[] = [];
  split.forEach((char) => {
    if (isDigit(char) || isDecimal(char)) {
      buffer.push(char);
    } else {
      if (buffer.length) {
        result.push({ type: 'literal', value: bufferToNumber(buffer) });
        buffer = [];
      }
      if (isOperator(char)) {
        result.push({ type: 'operator', value: char });
      } else if (isLeftParen(char)) {
        result.push({ type: 'lparen', value: char });
      } else if (isRightParen(char)) {
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

function isDecimal(ch: string): boolean {
  return ch === '.';
}

function isDigit(ch: string): boolean {
  return /\d/.test(ch);
}

function isOperator(ch: string): boolean {
  return /\+|-|\*|\//.test(ch);
}

function isLeftParen(ch: string): boolean {
  return ch === '(';
}

function isRightParen(ch: string): boolean {
  return ch === ')';
}