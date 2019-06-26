const associativityMap = {
    '!': 'right',
    '*': 'left',
    '/': 'left',
    '+': 'left',
    '-': 'left'
};
const precedenceMap = {
    '!': 4,
    '*': 3,
    '/': 3,
    '+': 2,
    '-': 2
};
export function parse(tokens) {
    const outStack = [];
    const stack = [];
    const pushNodeToOutStack = (pop) => {
        if (pop) {
            const onode = {
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
                        const o = topOfStack.value;
                        const tv = t.value;
                        if (precedenceMap[o] > precedenceMap[tv]) {
                            check = true;
                        }
                        else if (precedenceMap[o] === precedenceMap[tv] && associativityMap[o] === 'left') {
                            check = true;
                        }
                    }
                    if (check) {
                        pushNodeToOutStack(stack.pop());
                    }
                    else {
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
                    const pop = stack.pop();
                    if (pop.type === 'lparen') {
                        break;
                    }
                    else {
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
