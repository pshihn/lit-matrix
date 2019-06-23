export type Matrix = number[][];
export type MatrixSize = [number, number];

export function size(m: Matrix): MatrixSize {
  const rows = m.length || 0;
  const cols = rows ? m[0].length || 0 : 0;
  return [rows, cols];
}

export function sameSize(m1: Matrix, m2: Matrix): boolean {
  const [size1, size2] = [size(m1), size(m2)];
  return size1[0] === size2[0] && size1[1] === size2[1];
}

export function add(op1: number | Matrix, op2: number | Matrix): Matrix {
  const [scalar1, scalar2] = [typeof op1 !== 'number', typeof op2 !== 'number'];
  if (scalar1 && scalar2) {
    throw new Error('At least one of the operands needs to be a Matrix');
  }
  const result: Matrix = [];
  if ((!scalar1) && (!scalar2)) {
    const m1 = op1 as Matrix, m2 = op2 as Matrix;
    if (!sameSize(m1, m2)) {
      throw new Error('Cannot add matrices of different dimensions');
    }
    const dimensions = size(m1);
    for (let i = 0; i < dimensions[0]; i++) {
      const row: number[] = [];
      for (let j = 0; j < dimensions[1]; j++) {
        row.push(m1[i][j] + m2[i][j]);
      }
      result.push(row);
    }
  } else {
    const s = (scalar1 ? op1 : op2) as number;
    const m = (scalar1 ? op2 : op1) as Matrix;
    const dimensions = size(m);
    for (let i = 0; i < dimensions[0]; i++) {
      const row: number[] = [];
      for (let j = 0; j < dimensions[1]; j++) {
        row.push(m[i][j] + s);
      }
      result.push(row);
    }
  }
  return result;
}

export function sub(op1: number | Matrix, op2: number | Matrix): Matrix {
  const [scalar1, scalar2] = [typeof op1 !== 'number', typeof op2 !== 'number'];
  if (scalar1) {
    throw new Error('The first operand for subtraction cannot be a number');
  }
  const m1 = op1 as Matrix;
  const dimensions = size(m1);
  const result: Matrix = [];
  if (scalar2) {
    const s = op2 as number;
    for (let i = 0; i < dimensions[0]; i++) {
      const row: number[] = [];
      for (let j = 0; j < dimensions[1]; j++) {
        row.push(m1[i][j] - s);
      }
      result.push(row);
    }
  } else {
    const m2 = op2 as Matrix;
    if (!sameSize(m1, m2)) {
      throw new Error('Cannot subtract matrices of different dimensions');
    }
    for (let i = 0; i < dimensions[0]; i++) {
      const row: number[] = [];
      for (let j = 0; j < dimensions[1]; j++) {
        row.push(m1[i][j] - m2[i][j]);
      }
      result.push(row);
    }
  }
  return result;
}

export function multiply(op1: number | Matrix, op2: number | Matrix): Matrix {
  const [scalar1, scalar2] = [typeof op1 !== 'number', typeof op2 !== 'number'];
  if (scalar1 && scalar2) {
    throw new Error('At least one of the operands needs to be a Matrix');
  }
  const result: Matrix = [];
  if (scalar1 || scalar2) {
    const s = (scalar1 ? op1 : op2) as number;
    const m = (scalar1 ? op2 : op1) as Matrix;
    const dimensions = size(m);
    for (let i = 0; i < dimensions[0]; i++) {
      const row: number[] = [];
      for (let j = 0; j < dimensions[1]; j++) {
        row.push(m[i][j] * s);
      }
      result.push(row);
    }
  } else {
    const m1 = op1 as Matrix, m2 = op2 as Matrix;
    const [d1, d2] = [size(m1), size(m2)];
    let canMultiply = false;
    if (d1[0] && d2[0] && d1[1] && d2[1]) {
      canMultiply = d1[1] === d2[0];
    }
    if (!canMultiply) {
      throw new Error('Invalid matrix dimensions for multiplication');
    }
    for (let i = 0; i < d1[0]; i++) {
      const row: number[] = [];
      for (let j = 0; j < d2[1]; j++) {
        let v = 0;
        for (let k = 0; k < d1[1]; k++) {
          v += m1[i][k] * m2[k][j];
        }
        row.push(v);
      }
      result.push(row);
    }
  }
  return result;
}

export function transpose(m: Matrix): Matrix {
  const dimensions = size(m);
  const result: Matrix = [];
  for (let i = 0; i < dimensions[0]; i++) {
    for (let j = 0; j < dimensions[1]; j++) {
      if (!result[j]) {
        result[j] = [];
      }
      result[j][i] = m[i][j];
    }
  }
  return result;
}