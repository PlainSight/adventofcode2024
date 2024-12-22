var fs = require('fs');

var buyersSecret = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(BigInt);

const nextSecret = (sec) => {
    let s = sec;
    let mul = s * 64n;
    s = s ^ mul;
    s = s % 16777216n;

    let div = s / 32n;
    s = s ^ div;
    s = s % 16777216n;

    let mul2 = s * 2048n;
    s = s ^ mul2;
    s = s % 16777216n;
    return s;
}

let sum = 0n;
const changes = buyersSecret.map(n => []);
const prices = buyersSecret.map(n => []);
buyersSecret.forEach((b, bi) => {
    var secret = b;
    var lastSecret = b;
    for(var i = 0; i < 2000; i++) {
        secret = nextSecret(secret);
        const change = (secret % 10n) - (lastSecret % 10n);
        prices[bi].push(secret % 10n);
        changes[bi].push(change);
        lastSecret = secret;
    }
    sum += secret;
})

const findSeq = (seq, list) => {
    let seqMatch = 0;
    for(var i = 0; i < list.length; i++) {
        if (list[i] == seq[seqMatch]) {
            seqMatch++;
        }
        if (seqMatch == 4) {
            return i;
        }
    }
    return -1;
}

const diffDict = {};
const diffs = [];

changes.forEach((c, monkeyId) => {
    for(var i = 0; i < c.length-4; i++) {
        var d1 = c[i];
        var d2 = c[i+1];
        var d3 = c[i+2];
        var d4 = c[i+3];
        var key = `${d1},${d2},${d3},${d4}`;
        let diffDictVal = diffDict[key] ?? {
            seq: [d1, d2, d3, d4],
            monks: {}, 
            count: 0,
            value: 0n
        }
        if (!diffDictVal.monks[monkeyId]) {
            diffDictVal.monks[monkeyId] = true;
            diffDictVal.count++;
            diffDictVal.value += prices[monkeyId][i+3];
            diffDict[key] = diffDictVal;
        }
    }
})

console.log(Math.max(...Object.values(diffDict).map(n => Number(n.value))));
