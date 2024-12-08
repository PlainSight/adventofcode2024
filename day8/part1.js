var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split(''));

var nodesByType = {};

input.forEach((r, y) => {
    r.forEach((c, x) => {
        if (c != '.') {
            nodesByType[c] = nodesByType[c] || [];
            nodesByType[c].push([x, y]);
        }
    })
})

var maxx = input[0].length;
var maxy = input.length;

var antinodes = {};

Object.values(nodesByType).forEach(x => {
    x.forEach((n1, i) => {
        x.forEach((n2, j) => {
            if (j > i) {
                var diff1 = [n1[0] - n2[0], n1[1] - n2[1]];
                var diff2 = [n2[0] - n1[0], n2[1] - n1[1]];
                var loc1 = [n1[0] + diff1[0], n1[1] + diff1[1]];
                var loc2 = [n2[0] + diff2[0], n2[1] + diff2[1]];
                if (loc1[0] >= 0 && loc1[1] >= 0 && loc1[0] < maxx && loc1[1] < maxy) {
                    antinodes[loc1[0] + ',' + loc1[1]] = true;
                }
                if (loc2[0] >= 0 && loc2[1] >= 0 && loc2[0] < maxx && loc2[1] < maxy) {
                    antinodes[loc2[0] + ',' + loc2[1]] = true;
                }
            }
        })
    })
})

console.log(Object.values(antinodes).length)