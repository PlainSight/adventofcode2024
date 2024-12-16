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
    d: 0,
    parents: []
}];

var ds = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

var lowestScore = Number.MAX_SAFE_INTEGER;

var pathsForTheBestScore = [];

while(stack.length) {
    var top = stack.pop();

    if (top.v > lowestScore) {
        continue;
    }

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

    [3, 1, 0].forEach((dirDiff) => {
        var di = (top.d+dirDiff)%4;
        var d = ds[di];
        var nx = top.x + d[0];
        var ny = top.y + d[1];
        var nv = dirDiff == 0 ? (top.v+1) : (top.v+1001);

        if (input[ny][nx] != '#') {
            var key = k(nx,ny,di);

            const existingNode = seen[key];
            if (existingNode) {
                if (nv < existingNode.v) {
                    existingNode.v = nv;
                    existingNode.parents = [top];
                    stack.push(existingNode);
                    //we must reinsert as we now have a lower v
                } else {
                    if (nv == existingNode.v) {
                        existingNode.parents.push(top);
                    }
                }
            } else {
                const newNode = {
                    v: nv,
                    x: nx,
                    y: ny,
                    d: di,
                    parents: [top]
                };
                seen[key] = newNode;
                stack.push(newNode);
            }
        }
    })
}

var tilesInAllBestPaths = {};

const explorePaths = (n) => {
    tilesInAllBestPaths[n.x+','+n.y] = true;

    n.parents.forEach(p => {
        explorePaths(p);
    })
}

pathsForTheBestScore.forEach(p => {
    explorePaths(p);
})

console.log(Object.keys(tilesInAllBestPaths).length);