import { add, sub, multiply, inverse, checkScalars } from './matrix';
export function evaluate(node) {
    switch (node.token.type) {
        case 'literal':
        case 'variable':
            return node.token.value;
        case 'operator':
            return binaryOp(node.token.value, node.leftChild, node.rightChild);
    }
    throw new Error('Illegal expression');
}
function binaryOp(op, left, right) {
    if (op && left && right) {
        const lv = evaluate(left);
        const rv = evaluate(right);
        switch (op) {
            case '+':
                return doAdd(lv, rv);
            case '-':
                return doSub(lv, rv);
            case '*':
                return doMultiply(lv, rv);
            case '/':
                return doDivide(lv, rv);
        }
    }
    throw new Error('Illegal expression');
}
function doAdd(left, right) {
    const [scalar1, scalar2] = checkScalars(left, right);
    if (scalar1 && scalar2) {
        return left + right;
    }
    return add(left, right);
}
function doSub(left, right) {
    const [scalar1, scalar2] = checkScalars(left, right);
    if (scalar1 && scalar2) {
        return left - right;
    }
    return sub(left, right);
}
function doMultiply(left, right) {
    const [scalar1, scalar2] = checkScalars(left, right);
    if (scalar1 && scalar2) {
        return left * right;
    }
    return multiply(left, right);
}
function doDivide(left, right) {
    const [scalar1, scalar2] = checkScalars(left, right);
    if (scalar1 && scalar2) {
        return left / right;
    }
    if (scalar1 && !scalar2) {
        return multiply(left, inverse(right));
    }
    else if (scalar2 && !scalar1) {
        return multiply(left, 1 / right);
    }
    return multiply(left, inverse(right));
}
