var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

let cache = {};
let swappedOutputs = {};

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

const addSwappedOutputs = (a, b) => {
    swappedOutputs[a] = b;
    swappedOutputs[b] = a;
}

const resolveValue = (v) => {
    let cv = v;
    if (swappedOutputs[v]) {
        cv = swappedOutputs[v];
    }
    if (cache[cv] !== undefined) {
        return cache[cv];
    }
    const con = consByOut[cv];
    let res = null;
    switch(con.operation) {
        case 'AND':
            res =  resolveValue(con.in1) & resolveValue(con.in2);
            break;
        case 'OR':
            res =   resolveValue(con.in1) | resolveValue(con.in2);
            break;
        case 'XOR':
            res =   resolveValue(con.in1) ^ resolveValue(con.in2);
            break;
    }
    cache[cv] = res;
    return res;
}

let allFailuresOred = 0n;
let equationsTested = 0;

const testEquation = (a, b, expected) => {
    equationsTested++;
    cache = {};

    Object.values(inputNames).forEach((wires, i) => {
        var val = i == 0 ? a : b;
        wires.forEach((w, wi) => {
            cache[w] = 1n & (val >> BigInt(wi));
        })
    })

    var result = allZ.sort().map(z => {
        let zz = z;
        // if (swappedOutputs[z]) {
        //     zz = swappedOutputs[z];
        // }
        const t = resolveValue(zz);
        return t;
    }).reduce((a, c, i) => {
        return a | (BigInt(c) << BigInt(i));
    }, 0n);

    var diff = result ^ expected;

    allFailuresOred = diff | allFailuresOred;

    //console.log(a, b, result, expected, diff.toString(2));

    return [result, diff];
}

const maxInt = BigInt(Math.pow(2,45))-1n;

const testEquations = [
    [maxInt, 0n, maxInt],
    [maxInt/2n, maxInt/2n, 2n*(maxInt/2n)],
    [0n, 0n, 0n],
    [maxInt/2n, 0n, maxInt/2n],
    [15n, 100n, 115n],
    [5742342333415n, 1534534634n, 5742342333415n+1534534634n],
    [2n, 3n, 5n],
];

const cap = (n) => {
    return n & BigInt(Math.pow(2, 45)-1);
}

for(var a = 1; a < Math.pow(2, 44); a = a * 2) {
    for(var b = 1; b < Math.pow(2, 44); b = b * 2) {
        var aa = cap(BigInt(a));
        var bb = cap(BigInt(b));
        var res = cap(aa+bb);
        testEquations.push([aa, bb, res])
    }
}

var fib = 1n;
var lastfib = 0n;
while (fib < BigInt(Math.pow(2, 45))) {
    testEquations.push([fib, lastfib, fib+lastfib]);
    lastfib = fib;
    fib = fib + lastfib;
}

const inNodeByOrdinal = (o, l) => {
    if (o < 10) {
        return l+'0' + o;
    } else {
        return l + o;
    }
}

const outNodeByOrdinal = (o) => {
    if (o < 10) {
        return 'z0' + o;
    } else {
        return 'z' + o;
    }
}

const areInputWires = (w) => {
    return (w.includes('x') || w.includes('y'));
}

const zsToInputs = {};

const findRelatedInputs = (w) => {
    if (areInputWires(w)) {
        return [w];
    }
    if (consByOut[w]) {
        const a1 = findRelatedInputs(consByOut[w].in1);
        const a2 = findRelatedInputs(consByOut[w].in2);
        return a1.concat(a2);
    }
}

const findImmediateOutputsFor = (w) => {
    const outputWires = Object.entries(consByOut).filter(c => c[1].in1 == w || c[1].in2 == w);
    return outputWires.map(e => {
        return {
            out: e[0],
            ...e[1]
        }
    })
}

const findDistanceToMostDistantInput = (w) => {
    if (areInputWires(w)) {
        return 1;
    }
    if (consByOut[w]) {
        const d1 = findDistanceToMostDistantInput(consByOut[w].in1);
        const d2 = findDistanceToMostDistantInput(consByOut[w].in2);
        return 1 + Math.max(d1, d2);
    }
}

const distanceFromZToInput = [];
const inputsConnectedToByWire = {};
const allowedConnectionsByWire = {};

const setAllowedInputs = (w, allowed) => {
    if (areInputWires(w)) {
        return;
    }
    if (!allowedConnectionsByWire[w]) {
        allowedConnectionsByWire[w] = allowed;
    }
    if (consByOut[w]) {
        setAllowedInputs(consByOut[w].in1, allowed);
        setAllowedInputs(consByOut[w].in2, allowed);
    }
}


const displayAttachedFor = (...args) => {
    console.log(args.map(a => {
        const outputs = findImmediateOutputsFor(a).map(x => x.out).join(' ,');
        let input = ''
        let op = '';
        if (consByOut[a]) {
            input = `${consByOut[a].in1}, ${consByOut[a].in2}`;
            op = consByOut[a].operation;
        }
        return `${a} | in: ${input} op: ${op} out: ${outputs}`;
    }).join('\r\n'));
}

const getSubformulaFor = (w, d) => {
    let ww = w;
    if (swappedOutputs[w]) {
        ww = swappedOutputs[w];
    }
    if (areInputWires(ww)) {
        return w;
    }
    if (consByOut[ww]) {
        let a = getSubformulaFor(consByOut[ww].in1, d+1);
        let b = getSubformulaFor(consByOut[ww].in2, d+1);
        if (a.length < 14) {
            return `[${ww}](${a} ${consByOut[ww].operation} ${b})`;
        }
        let tabs = '\r\n';
        for(var i = 0; i < d; i++) {
            tabs += ' ';
        }
        if (a.length > b.length) {
            return `[${ww}](${tabs}${b} ${consByOut[ww].operation}${tabs}${a})`;
        } else {
            return `[${ww}](${tabs}${a} ${consByOut[ww].operation} ${b})`;
        }
    }
}

const displayFormulaFor = (...args) => {
    return args.forEach(x => {
        console.log(x + ' = ' + getSubformulaFor(x, 0));
    })
}

Object.keys(consByOut).forEach(c => {
    inputsConnectedToByWire[c] = findRelatedInputs(c, c == 'z08').reduce((a, c) => {
        if (!a.includes(c)) {
            a.push(c);
        }
        return a;
    }, []);
});

addSwappedOutputs('npf', 'z13');
addSwappedOutputs('gws', 'nnt');
addSwappedOutputs('cph', 'z19');
addSwappedOutputs('z33', 'hgj')

console.log(Object.keys(swappedOutputs).sort().join(','));

//displayAttachedFor('x09', 'y09', 'nnt', 'gws')
//displayAttachedFor('x13', 'y13', 'fmh', 'tqs', 'kvr', 'npf')
//displayAttachedFor('x19', 'y19', 'fnq', 'dgm', 'cph')
//displayFormulaFor('z19', 'cph')
//displayAttachedFor('x33', 'y33', 'z33', 'wtm', 'wgq', 'fvk', 'hgj')
//displayFormulaFor('z33', 'wgq', 'wvn', 'hgj')

testEquations.forEach(te => {
    var diff = testEquation(...te);
    if (diff[1] != 0n) {
        console.log(te, diff);
    }
})

console.log('i', allFailuresOred.toString(2).split('').map((x, i) => ''+((allZ.length - i - 1)%10)).join(''));
console.log('v', allFailuresOred.toString(2));

// {
//     for (var i = 0n; i < allZ.length; i++) {
//         const nodeName = outNodeByOrdinal(i);

//         const allowedInputs = [];
//         for(var n = 0; n <= i; n++) {
//             allowedInputs.push(inNodeByOrdinal(n, 'x'));
//             allowedInputs.push(inNodeByOrdinal(n, 'y'));
//         }

//         setAllowedInputs(nodeName, allowedInputs);

//         const r = {
//             n: nodeName,
//             knownFailure: ((allFailuresOred >> i) & 1n) == 1,
//             dist: findDistanceToMostDistantInput(nodeName)
//         }
//         distanceFromZToInput.push(r)
//     }
// }

//console.log(distanceFromZToInput);
