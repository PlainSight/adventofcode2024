var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

let cache = {};

const inputNames = input[0].split('\r\n').map(v => {
    var [name, _] = /([a-z0-9]+): ([01])/.exec(v).slice(1);
    return name;
}).reduce((a, c) => {
    const variable = /([a-z])/.exec(c);
    a[variable] = a[variable] ?? [];
    a[variable].push(c);
    return a;
}, {});

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

let allFailuresOred = 0n;

const testEquation = (a, b, expected) => {
    cache = {};

    Object.values(inputNames).forEach((wires, i) => {
        var val = i == 0 ? a : b;
        wires.forEach((w, wi) => {
            cache[w] = 1n & (val >> BigInt(wi));
        })
    })

    var result = allZ.sort().map(z => {
        const t = resolveValue(z);
        return t;
    }).reduce((a, c, i) => {
        return a | (BigInt(c) << BigInt(i));
    }, 0n);

    var diff = result ^ expected;

    allFailuresOred = diff | allFailuresOred;

    //console.log(a, b, result, expected, diff.toString(2));

    return diff;
}

const maxInt = BigInt(Math.pow(2,45))-1n;

const testEquations = [
    [maxInt, 0n, maxInt],
    [maxInt/2n, maxInt/2n, maxInt],
    [0n, 0n, 0n],
    [maxInt/2n, 0n, maxInt/2n],
    [15n, 100n, 115n],
    [5742342333415n, 1534534634n, 5742342333415n+1534534634n],
    [2n, 3n, 5n],
];

const cap = (n) => {
    return n & BigInt(Math.pow(2, 45)-1);
}

for(var a = 1; a < Math.pow(2, 46); a = a * 2) {
    for(var b = 1; b < Math.pow(2, 46); b = b * 2) {
        var aa = cap(BigInt(a));
        var bb = cap(BigInt(b));
        var res = cap(aa+bb);
        testEquations.push([aa, bb, res])
    }
}

var fib = 1n;
var lastfib = 0n;
while (fib < BigInt(Math.pow(2, 46))) {
    testEquations.push([fib, lastfib, fib+lastfib]);
    lastfib = fib;
    fib = fib + lastfib;
}

testEquations.forEach(te => {
    testEquation(...te)
})

console.log(allFailuresOred.toString(2));

const knownGoodWires = {};

const outNodeByOrdinal = (o) => {
    if (o < 10) {
        return 'z0' + o;
    } else {
        return 'z' + o;
    }
}

// let numberOfChildren = {};
// let wireByMisbehavior = {};

// Object.keys(consByOut).forEach(k => {
//     wireByMisbehavior[k] = {};
//     numberOfChildren[k] = {};
// })

// const markNumberOfChildren = (w, original) => {
//     if (w.includes('x') || w.includes('y')) {
//         return;
//     }
//     numberOfChildren[w] = numberOfChildren[w] ?? {};
//     numberOfChildren[w][original] = original;

//     if (consByOut[w]) {
//         markNumberOfChildren(consByOut[w].in1, w);
//         markNumberOfChildren(consByOut[w].in2, w);
//     }
// }

// const markAsBad = (w, original) => {
//     if (w.includes('x') || w.includes('y')) {
//         return;
//     }
//     wireByMisbehavior[w] = wireByMisbehavior[w] ?? {};
//     wireByMisbehavior[w][original] = original;

//     if (consByOut[w]) {
//         markAsBad(consByOut[w].in1, w);
//         markAsBad(consByOut[w].in2, w);
//     }
// }

const markAsGood = (w) => {
    knownGoodWires[w] = true;
    if (consByOut[w]) {
        const op = consByOut[w].operation;
        const p1 = consByOut[w].in1;
        const p2 = consByOut[w].in2;
        if (op == 'AND' || op == 'XOR') {
            markAsGood(p1);
            markAsGood(p2);
        }
    }
}

{
    let failureBitset = allFailuresOred;
    for (var i = 0n; i < allZ.length; i++) {
        const nodeName = outNodeByOrdinal(i);
        markNumberOfChildren(nodeName, nodeName);
        if (((failureBitset >> i) & 1n) == 0) {
            markAsGood(nodeName);
        } else {
            markAsBad(nodeName, nodeName);
        }
    }
}

const candidateFailures = Object.keys(consByOut).filter(c => !knownGoodWires[c]);

const topLevelfailures = {};

const exploreFailures = (n) => {
    const op = consByOut[n].operation;
    const p1 = consByOut[n].in1;
    let failingP1 = false;
    if (candidateFailures.includes(p1)) {
        failingP1 = true;
    }
    const p2 = consByOut[n].in2;
    let failingP2 = false;
    if (candidateFailures.includes(p2)) {
        failingP2 = true;
    }
    if(failingP1 || failingP2) {
        // console.log(n, 'is good');
        // if (failingP1) {
        //     console.log(p1, ' p1 is bad');
        // }
        // if (failingP2) {
        //     console.log(p2, ' p2 is bad');
        // }
    } else {
        topLevelfailures[n] = n;
        //console.log(n, 'is bad, parents:', p1, p2, knownGoodWires[p1], knownGoodWires[p2], op)
    }
}

candidateFailures.forEach(cf => {
    exploreFailures(cf);
})

var topMisbehavors = Object.entries(wireByMisbehavior);

// console.log(topMisbehavors.map(e => {
//     return {
//         k: e[0],
//         v: Object.values(e[1]).length,
//         c: Object.values(numberOfChildren[e[0]]).length,
//         p: Object.values(e[1]).length / Object.values(numberOfChildren[e[0]]).length
//     }
// }).sort((a, b) => a.p - b.p));

console.log(Object.values(candidateFailures));
console.log(Object.values(topLevelfailures).map(tlf => {
    return {
        k: tlf,
        c: Object.values(numberOfChildren[tlf]).length,
        fc: Object.values(wireByMisbehavior[tlf]).length
    }
}).sort((a, b) => b.fc - a.fc));

console.log('known good', Object.values(knownGoodWires).length);

const decendentsOfGood = Object.keys(consByOut).filter(k => !knownGoodWires[k]).filter(k => knownGoodWires[consByOut[k].in1] && knownGoodWires[consByOut[k].in2]);

console.log(decendentsOfGood.length);

const ancestorsOfGood = Object.keys(cons)