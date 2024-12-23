var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split('-'));

const connections = {};

input.forEach(c => {
    connections[c[0]] = connections[c[0]] || [];
    connections[c[0]].push(c[1]);

    connections[c[1]] = connections[c[1]] || [];
    connections[c[1]].push(c[0]);
});

let sets = {};

const is3Connected = (vals) => {
    let good = true;
    vals.forEach((v, vi) => {
        const others = [ vals[(vi+1)%3], vals[(vi+2)%3] ];
        if (!others.every(o => {
            return connections[v].includes(o);
        })) {
            good = false;
        }
    })
    return good;
}

Object.keys(connections).forEach(c => {
    const neighbours = connections[c];
    neighbours.forEach((n1, n1i) => {
        neighbours.forEach((n2, n2i) => {
            if (n2i > n1i) {
                const sorted = [c, n1, n2].sort();
                if (is3Connected([c, n1, n2])) {
                    sets[sorted.join(',')] = sorted;
                }
            }
        })
    })
})

console.log(Object.values(sets).filter(s => s.some(ss => ss.startsWith('t'))).length);