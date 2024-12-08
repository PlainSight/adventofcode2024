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

// const gcd = (a, b) => {
//     if (b == 0) {
//         return a;
//     }
//     return gcd(b, a % b);
// }

const inBounds = (loc1) => {
    return (loc1[0] >= 0 && loc1[1] >= 0 && loc1[0] < maxx && loc1[1] < maxy);
}

const k = (loc1) => {
    return loc1[0] + ',' + loc1[1];
}

Object.values(nodesByType).forEach(x => {
    x.forEach((n1, i) => {
        x.forEach((n2, j) => {
            if (j > i) {
                var diff = [n1[0] - n2[0], n1[1] - n2[1]];

                // var div = gcd(diff[0], diff[1]);

                // console.log(div);

                // diff[0] /= div;
                // diff[1] /= div;

                var point = [...n1];

                while (inBounds(point)) {
                    antinodes[k(point)] = true;

                    point[0] += diff[0];
                    point[1] += diff[1];
                }

                point = [...n1];

                while (inBounds(point)) {
                    antinodes[k(point)] = true;

                    point[0] -= diff[0];
                    point[1] -= diff[1];
                }
            }
        })
    })
})

console.log(Object.values(antinodes).length)