export declare type Matrix = number[][];
export declare type MatrixSize = [number, number];
export declare function size(m: Matrix): MatrixSize;
export declare function sameSize(m1: Matrix, m2: Matrix): boolean;
export declare function add(op1: number | Matrix, op2: number | Matrix): Matrix;
export declare function sub(op1: number | Matrix, op2: number | Matrix): Matrix;
export declare function multiply(op1: number | Matrix, op2: number | Matrix): Matrix;
export declare function transpose(m: Matrix): Matrix;
