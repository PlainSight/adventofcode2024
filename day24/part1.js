var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

const cache = {};

input[0].split('\r\n').forEach(v => {
    var [name, value] = /([a-z0-9]+): ([01])/.exec(v).slice(1);
    cache[name] = Number(value);
});

//x00 AND y00 -> z00

let allZ = [];

var consByOut = {};

input[1].split('\r\n').forEach(c => {
    var [in1, operation, in2, out] = /([a-z0-9]+) ([A-Z]+) ([a-z0-9]+) -> ([a-z0-9]+)/.exec(c).slice(1);
    if (out.includes('z')) {
        allZ.push(out);
    }
    consByOut[out] = {
        in1: in1,
        in2: in2,
        operation: operation
    }
});

const resolveValue = (v) => {
    if (cache[v] !== undefined) {
        return cache[v];
    }
    const con = consByOut[v];
    switch(con.operation) {
        case 'AND':
            return resolveValue(con.in1) & resolveValue(con.in2);
        case 'OR':
            return resolveValue(con.in1) | resolveValue(con.in2);
        case 'XOR':
            return resolveValue(con.in1) ^ resolveValue(con.in2);
    }
}

var result = allZ.sort().map(z => {
    const t = resolveValue(z);
    return t;
}).reduce((a, c, i) => {
    return a | (BigInt(c) << BigInt(i));
}, 0n)

console.log(Number(result));