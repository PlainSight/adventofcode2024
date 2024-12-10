var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split('').map(Number));

var seen = {};

var ds = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
]

const inBounds = (x, y) => {
    return x >= 0 && x < input[0].length && y >= 0 && y < input.length;
}

const search = (x, y, h) => {
    if (h == 9) {
        seen[x+','+y] = true;
        return;
    }
    ds.forEach(d => {
        var xx = x + d[0];
        var yy = y + d[1];
        if (inBounds(xx, yy) && input[yy][xx] == h+1) {
            search(xx, yy, h+1);
        }
    });
}

var sumSeen = 0;

for(var x = 0; x < input[0].length; x++) {
    for (var y = 0; y < input.length; y++) {
        if (input[y][x] == 0) {
            search(x, y, 0);
            sumSeen += Object.values(seen).length;
            seen = {};
        }
    }
}

console.log(sumSeen);