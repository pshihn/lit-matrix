import { Token } from './tokenizer';
export interface SyntaxNode {
    token: Token;
    leftChild?: SyntaxNode;
    rightChild?: SyntaxNode;
}
export declare function parse(tokens: Token[]): SyntaxNode;
