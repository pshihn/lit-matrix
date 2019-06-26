import { SyntaxNode } from './parser';
import { Matrix, add, sub, multiply, inverse, checkScalars } from './matrix';

type ExpValue = number | Matrix;

export function evaluate(node: SyntaxNode): number | Matrix {
  switch (node.token.type) {
    case 'literal':
    case 'variable':
      return node.token.value as any;
    case 'operator':
      return binaryOp(node.token.value as string, node.leftChild, node.rightChild);
  }
  throw new Error('Illegal expression');
}

function binaryOp(op: string, left?: SyntaxNode, right?: SyntaxNode): ExpValue {
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

function doAdd(left: ExpValue, right: ExpValue): ExpValue {
  const [scalar1, scalar2] = checkScalars(left, right);
  if (scalar1 && scalar2) {
    return (left as number) + (right as number);
  }
  return add(left, right);
}

function doSub(left: ExpValue, right: ExpValue): ExpValue {
  const [scalar1, scalar2] = checkScalars(left, right);
  if (scalar1 && scalar2) {
    return (left as number) - (right as number);
  }
  return sub(left, right);
}

function doMultiply(left: ExpValue, right: ExpValue): ExpValue {
  const [scalar1, scalar2] = checkScalars(left, right);
  if (scalar1 && scalar2) {
    return (left as number) * (right as number);
  }
  return multiply(left, right);
}

function doDivide(left: ExpValue, right: ExpValue): ExpValue {
  const [scalar1, scalar2] = checkScalars(left, right);
  if (scalar1 && scalar2) {
    return (left as number) / (right as number);
  }
  if (scalar1 && !scalar2) {
    return multiply(left, inverse(right as Matrix));
  } else if (scalar2 && !scalar1) {
    return multiply(left as Matrix, 1 / (right as number));
  }
  return multiply(left as Matrix, inverse(right as Matrix));
}