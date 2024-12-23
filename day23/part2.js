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

const isNConnected = (vals) => {
    let good = true;
    vals.forEach((v) => {
        const others = vals.filter(vv => vv != v);
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
    let currentLargestNeighbourSet = [];
    neighbours.forEach((n) => {
        let testSet = [c, ...currentLargestNeighbourSet, n];
        if (isNConnected(testSet)) {
            currentLargestNeighbourSet.push(n);
        }
    })
    const sorted = [...currentLargestNeighbourSet, c].sort();
    sets[sorted.join(',')] = sorted;
})

console.log(Object.keys(sets).sort((a, b) => b.length - a.length)[0]);