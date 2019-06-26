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

export function parse(tokens: Token[]): Token[] {
  const queue: Token[] = [];
  const stack: Token[] = [];

  tokens.forEach((t) => {
    switch (t.type) {
      case 'literal':
      case 'variable':
        queue.push(t);
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
            const [pop] = stack.splice(stack.length - 1);
            queue.push(pop);
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
          const [pop] = stack.splice(stack.length - 1);
          if (pop.type === 'lparen') {
            break;
          } else {
            queue.push(pop);
          }
        }
        break;
    }
  });
  while (stack.length) {
    const [pop] = stack.splice(stack.length - 1);
    queue.push(pop);
  }

  return queue;
}