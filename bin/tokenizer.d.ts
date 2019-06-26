import { Matrix } from './matrix';
declare type TokenType = 'literal' | 'variable' | 'operator' | 'rparen' | 'lparen';
export interface Token {
    type: TokenType;
    value: string | number | Matrix;
}
export declare function tokenize(strings: string[], keys: (number | Matrix)[]): Token[];
export {};
