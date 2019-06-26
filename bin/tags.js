import { parse } from './parser';
import { tokenize } from './tokenizer';
import { evaluate } from './evaluator';
export function matrix(strings, ...keys) {
    const buffer = [];
    for (let i = 0; i < strings.length; i++) {
        buffer.push(strings[i]);
        if (i < (strings.length - 1)) {
            buffer.push((typeof keys[i] === 'number') ? keys[i] : 0);
        }
    }
    const raw = buffer.join('').trim();
    const rows = (raw.indexOf(',') >= 0 ? raw.split(',') : raw.split('\n')).filter((d) => !!d.trim());
    const m = [];
    let maxCols = 0;
    for (let i = 0; i < rows.length; i++) {
        const r = [];
        const split = rows[i].trim().split(' ');
        split.forEach((d) => {
            if (d && d.trim()) {
                const n = +d;
                if (!Number.isNaN(n)) {
                    r.push(n);
                }
            }
        });
        maxCols = Math.max(maxCols, r.length);
        m.push(r);
    }
    for (let i = 0; i < m.length; i++) {
        while (m[i].length < maxCols) {
            m[i].push(0);
        }
    }
    return m;
}
export function meq(strings, ...keys) {
    const tokens = tokenize(strings, keys);
    const node = parse(tokens);
    return evaluate(node);
}
