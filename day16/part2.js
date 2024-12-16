var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split(''));

var sx = 0;
var sy = 0;

input.forEach((r, y) => {
    r.forEach((c, x) => {
        if (c == 'S') {
            sx = x;
            sy = y;
        }
    })
})

var seen = new Array(input.length * input[0].length * 4);

const k = (x, y, d) => {
    return 4*((y*input[0].length)+x) + d;
}

var stack = [{
    v: 0,
    x: sx,
    y: sy,
    d: 0
}];

var ds = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];


var lowestScore = Number.MAX_SAFE_INTEGER;

var counter = 0;

var pathsForTheBestScore = [];

while(stack.length) {
    counter++;
    var top = stack.pop();

    if (input[top.y][top.x] == 'E') {
        if (top.v == lowestScore) {
            pathsForTheBestScore.push(top);
        }
        if (top.v < lowestScore) {
            lowestScore = top.v;
            pathsForTheBestScore = [];
            pathsForTheBestScore.push(top)
        }
        continue;
    }

    ds.forEach((d, di) => {
        var dirDiff = Math.abs(di - top.d);
        if (dirDiff != 2) {
            var nx = top.x + d[0];
            var ny = top.y + d[1];
            var nv = dirDiff == 0 ? (top.v+1) : (top.v+1001);

            if (input[ny][nx] != '#') {
                var key = k(nx,ny,di);
                if (nv <= (seen[key] ?? Number.MAX_SAFE_INTEGER)) {
                    seen[key] = nv;
                    stack.push({
                        v: nv,
                        x: nx,
                        y: ny,
                        d: di,
                        parent: top
                    });
                }
            }
        }
    })
}

const extractTiles = (n) => {
    let list = [];

    while(n.parent) {
        list.push(n.x+','+n.y);
        n = n.parent;
    }
    return list;
}

var tilesInAllBestPaths = {};

pathsForTheBestScore.forEach(p => {
    var tiles = extractTiles(p);
    tiles.forEach(n => {
        tilesInAllBestPaths[n] = true;
    })
})

console.log(Object.values(tilesInAllBestPaths).length + 1);