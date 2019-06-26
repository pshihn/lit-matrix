function size(m) {
    const rows = m.length || 0;
    const cols = rows ? m[0].length || 0 : 0;
    return [rows, cols];
}
function sameSize(m1, m2) {
    const [size1, size2] = [size(m1), size(m2)];
    return size1[0] === size2[0] && size1[1] === size2[1];
}
export function checkScalars(...values) {
    return values.map((v) => (typeof v === 'number'));
}
export function add(op1, op2) {
    const [scalar1, scalar2] = checkScalars(op1, op2);
    if (scalar1 && scalar2) {
        throw new Error('At least one of the operands needs to be a Matrix');
    }
    const result = [];
    if ((!scalar1) && (!scalar2)) {
        const m1 = op1, m2 = op2;
        if (!sameSize(m1, m2)) {
            throw new Error('Cannot add matrices of different dimensions');
        }
        const dimensions = size(m1);
        for (let i = 0; i < dimensions[0]; i++) {
            const row = [];
            for (let j = 0; j < dimensions[1]; j++) {
                row.push(m1[i][j] + m2[i][j]);
            }
            result.push(row);
        }
    }
    else {
        const s = (scalar1 ? op1 : op2);
        const m = (scalar1 ? op2 : op1);
        const dimensions = size(m);
        for (let i = 0; i < dimensions[0]; i++) {
            const row = [];
            for (let j = 0; j < dimensions[1]; j++) {
                row.push(m[i][j] + s);
            }
            result.push(row);
        }
    }
    return result;
}
export function sub(op1, op2) {
    const [scalar1, scalar2] = checkScalars(op1, op2);
    if (scalar1) {
        throw new Error('The first operand for subtraction cannot be a number');
    }
    const m1 = op1;
    const dimensions = size(m1);
    const result = [];
    if (scalar2) {
        const s = op2;
        for (let i = 0; i < dimensions[0]; i++) {
            const row = [];
            for (let j = 0; j < dimensions[1]; j++) {
                row.push(m1[i][j] - s);
            }
            result.push(row);
        }
    }
    else {
        const m2 = op2;
        if (!sameSize(m1, m2)) {
            throw new Error('Cannot subtract matrices of different dimensions');
        }
        for (let i = 0; i < dimensions[0]; i++) {
            const row = [];
            for (let j = 0; j < dimensions[1]; j++) {
                row.push(m1[i][j] - m2[i][j]);
            }
            result.push(row);
        }
    }
    return result;
}
export function multiply(op1, op2) {
    const [scalar1, scalar2] = checkScalars(op1, op2);
    if (scalar1 && scalar2) {
        throw new Error('At least one of the operands needs to be a Matrix');
    }
    const result = [];
    if (scalar1 || scalar2) {
        const s = (scalar1 ? op1 : op2);
        const m = (scalar1 ? op2 : op1);
        const dimensions = size(m);
        for (let i = 0; i < dimensions[0]; i++) {
            const row = [];
            for (let j = 0; j < dimensions[1]; j++) {
                row.push(m[i][j] * s);
            }
            result.push(row);
        }
    }
    else {
        const m1 = op1, m2 = op2;
        const [d1, d2] = [size(m1), size(m2)];
        let canMultiply = false;
        if (d1[0] && d2[0] && d1[1] && d2[1]) {
            canMultiply = d1[1] === d2[0];
        }
        if (!canMultiply) {
            throw new Error('Invalid matrix dimensions for multiplication');
        }
        for (let i = 0; i < d1[0]; i++) {
            const row = [];
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
export function transpose(m) {
    const dimensions = size(m);
    const result = [];
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
function isSquare(m) {
    const dimensions = size(m);
    return dimensions[0] === dimensions[1];
}
function minor(m, row, col) {
    const minor = [];
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; i !== row && j < m[i].length; j++) {
            if (j !== col) {
                const r = i < row ? i : i - 1;
                if (!minor[r]) {
                    minor[r] = [];
                }
                minor[r][j < col ? j : j - 1] = m[i][j];
            }
        }
    }
    return minor;
}
function determinant(m) {
    const n = m.length;
    if (n === 0 || (!isSquare(m))) {
        throw new Error('Invalid matrix dimensions for calculating determinant');
    }
    if (n === 1) {
        return m[0][0];
    }
    if (n === 2) {
        return m[0][0] * m[1][1] - m[0][1] * m[1][0];
    }
    let det = 0;
    for (let i = 0; i < m[0].length; i++) {
        det += Math.pow(-1, i) * m[0][i] * determinant(minor(m, 0, i));
    }
    return det;
}
export function inverse(m) {
    let inversible = isSquare(m);
    let det = 0;
    if (inversible) {
        det = determinant(m);
        inversible = det !== 0;
    }
    if (!inversible) {
        throw new Error('Matrix nor inversible');
    }
    const inverse = [];
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            if (!inverse[i]) {
                inverse[i] = [];
            }
            inverse[i][j] = Math.pow(-1, i + j) * determinant(minor(m, i, j));
        }
    }
    const idet = 1.0 / det;
    for (let i = 0; i < inverse.length; i++) {
        for (let j = 0; j <= i; j++) {
            const temp = inverse[i][j];
            inverse[i][j] = inverse[j][i] * idet;
            inverse[j][i] = temp * idet;
        }
    }
    return inverse;
}
