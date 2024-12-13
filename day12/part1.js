var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split(''));

var seen = new Array(input.length * input[0].length);

const k = (x, y) => {
    return y * input[0].length + x;
}

const beenSeen = (x, y) => {
    return !!seen[k(x, y)];
}

const inBounds = (x, y) => {
    return x >= 0 && x < input[0].length && y >= 0 && y < input.length;
}

var ds = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
];

const floodArea = (x, y, c) => {
    if (!inBounds(x, y)) {
        return [0, 0];
    }
    if (input[y][x] != c) {
        return [0, 0];
    }
    seen[k(x, y)] = true;
    var surface = 0;
    var area = 1;
    ds.forEach(d => {
        var xx = x + d[0];
        var yy = y + d[1];

        if (!inBounds(xx, yy) || input[yy][xx] != c) {
            surface++;
        }

        if (!beenSeen(xx, yy)) {
            var [ca, cs] = floodArea(xx, yy, c);
            if (ca != 0) {
                area += ca;
                surface += cs;
            }
        }
    });
    return [area, surface];
}

var totalCost = 0;

for(var x = 0; x < input[0].length; x++) {
    for (var y = 0; y < input.length; y++) {
        if (!beenSeen(x, y)) {
            var character = input[y][x];
            var [na, ns] = floodArea(x, y, character);
            totalCost += (na * ns);
        }
    }
}

console.log(totalCost);