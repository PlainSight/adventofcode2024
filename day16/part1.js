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

var seen = {};

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

while(stack.length) {
    var top = stack.pop();

    if (input[top.y][top.x] == 'E') {
        if (top.v < lowestScore) {
            lowestScore = top.v;
        }
        continue;
    }

    ds.forEach((d, di) => {
        var dirDiff = Math.abs(di - top.d);
        if (dirDiff != 2) {
            var nx = top.x + d[0];
            var ny = top.y + d[1];
            var nv = dirDiff == 0 ? (top.v+1) : (top.v+1001);

            if (nv < (seen[nx+','+ny+','+di] ?? Number.MAX_SAFE_INTEGER)) {
                seen[nx+','+ny+','+di] = nv;
                if (input[ny][nx] != '#') {
                    stack.push({
                        v: nv,
                        x: nx,
                        y: ny,
                        d: di
                    })
                }
            }
        }
    })
}

console.log(lowestScore);