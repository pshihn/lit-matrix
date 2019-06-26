import { Token } from './tokenizer';

type Associativity = 'left' | 'right';

const associativityMap: { [op: string]: Associativity } = {
  '!': 'right',
  '*': 'left',
  '/': 'left',
  '+': 'left',
  '-': 'left'
};

const precedenceMap: { [op: string]: number } = {
  '!': 4,
  '*': 3,
  '/': 3,
  '+': 2,
  '-': 2
};

export interface SyntaxNode {
  token: Token;
  leftChild?: SyntaxNode;
  rightChild?: SyntaxNode;
}

export function parse(tokens: Token[]): SyntaxNode {
  const outStack: SyntaxNode[] = [];
  const stack: Token[] = [];

  const pushNodeToOutStack = (pop?: Token) => {
    if (pop) {
      const onode: SyntaxNode = {
        token: pop,
        rightChild: outStack.pop(),
        leftChild: outStack.pop()
      };
      outStack.push(onode);
    }
  };

  tokens.forEach((t) => {
    switch (t.type) {
      case 'literal':
      case 'variable':
        outStack.push({
          token: t
        });
        break;
      case 'operator':
        while (true) {
          let check = false;
          const topOfStack = stack.length ? stack[stack.length - 1] : null;
          if (topOfStack && topOfStack.type === 'operator') {
            const o = topOfStack.value as string;
            const tv = t.value as string;
            if (precedenceMap[o] > precedenceMap[tv]) {
              check = true;
            } else if (precedenceMap[o] === precedenceMap[tv] && associativityMap[o] === 'left') {
              check = true;
            }
          }
          if (check) {
            pushNodeToOutStack(stack.pop());
          } else {
            break;
          }
        }
        stack.push(t);
        break;
      case 'lparen':
        stack.push(t);
        break;
      case 'rparen':
        while (stack.length) {
          const pop = stack.pop()!;
          if (pop.type === 'lparen') {
            break;
          } else {
            pushNodeToOutStack(pop);
          }
        }
        break;
    }
  });
  while (stack.length) {
    pushNodeToOutStack(stack.pop());
  }

  if (outStack.length !== 1) {
    throw new Error('Failed to parse expression');
  }
  return outStack[0];
}