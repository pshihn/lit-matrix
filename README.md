# lit-matrix

Perform Matrix math using tagged template literals

## Usage

**Define matrices** using `matrix` tagged template. The result is a two dimensional array of numbers.

Each row in the matrix is separated by a new line or by a `,`

```javascript
const A = matrix`
  -27  6   3
  10  -3  -5
  -4  -3   2
`;

const B = matrix`-27  6   3, 10  -3  -5, -4  -3   2`;
```

**Evaulate matrix equations** using the `meq` tagged template. 

```javascript
// AB + (-2.5 * B)
const result = meq`${A}${B} + (-2.5 * ${B})`;
```

You can pass in a mtrix as a 2D array as well

```javascript
const B = [
  [1, 2, 3],
  [4, 5, 6],
  [7. 8. 9]
];
const result = meq`${A} + ${B})`;
```

### Example

```javascript
import {matrix, meq} from 'lit-matrix';

const A = matrix`
  -27  6   3
  10  -3  -5
  -4  -3   2
`;

const B = matrix`
  6
  -4
  27
`;

// Evaluate (-1/20)AB + B
// Result = 11
//          -1
//          25
const result = meq`(-1 / 20)${A}${B} + ${B}`;
```


