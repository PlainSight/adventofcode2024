var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

const passwords = input.map(n => n.split(''));

var directionPadMap = [
    [null, '^', 'A'],
    ['<', 'v', '>']
];
var numberPadMap = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    [null, '0', 'A']
];

const find = (character, map) => {
    let ans = [-1, -1];
    map.forEach((r, y) => {
        r.forEach((c, x) => {
            if (c == character) {
                ans = [x, y];
            }
        })
    })
    return ans;
}

const k = (x, y) => {
    return `${x},${y}`;
}

var ds = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
];

const resolvePathToMoves = (end, startChar, endChar, map) => {
    const path = ['A'];
    let current = end;
    while(current.parent) {
        const dx = current.x - current.parent.x;
        const dy = current.y - current.parent.y;

        if (dx == 0) {
            if (dy > 0) {
                path.unshift('v');
            } else {
                path.unshift('^');
            }
        }
        if (dy == 0) {
            if (dx > 0) {
                path.unshift('>');
            } else {
                path.unshift('<');
            }
        }
        current = current.parent;
    }

    // everything that follows is evil
    const sortDistFromA = {
        'A': 4,
        'v': 2,
        '^': 1,
        '<': 0,
        '>': 2
    }

    const sortOrderVert = {
        'A': 4,
        'v': 1,
        '^': 1,
        '<': 2,
        '>': 2,
    }
    const sortOrderHori = {
        'A': 4,
        'v': 2,
        '^': 2,
        '<': 1,
        '>': 1,
    }
    let sortOrder = sortDistFromA;

    if (map.length > 2) {
        const illegalMoves = {
            '7': 3,
            '4': 2,
            '1': 1,
            '0': 1,
            'A': 2
        }
    
        // left side of num pad 
        if (['7', '4', '1'].includes(startChar) && path.filter(p => p == 'v').length >= illegalMoves[startChar]) {
            sortOrder = sortOrderHori;
        }
    
        if (['0', 'A'].includes(startChar) && path.filter(p => p == '<').length >= illegalMoves[startChar]) {
            sortOrder = sortOrderVert;
        }
    } else {
        const illegalMoves = {
            '<': 1,
            '^': 1,
            'A': 2
        }
    
        // left side of d pad 
        if (['<'].includes(startChar) && path.filter(p => p == '^').length >= illegalMoves[startChar]) {
            sortOrder = sortOrderHori;
        }
    
        if (['^', 'A'].includes(startChar) && path.filter(p => p == '<').length >= illegalMoves[startChar]) {
            sortOrder = sortOrderVert;
        }
    }

    path.sort((a, b) => sortOrder[a] - sortOrder[b]);

    return path;
}

const findPath = (startChar, endChar, map) => {
    if (startChar == endChar) {
        return ['A'];
    }
    var [sx, sy] = find(startChar, map);
    var [ex, ey] = find(endChar, map);

    const seen = {};

    seen[k(sx, sy)] = true;

    const stack = [{
        x: sx,
        y: sy,
        d: 0
    }];

    let res = null;

    while(stack.length && res == null) {
        const bottom = stack.shift();

        ds.forEach(d => {
            const nx = bottom.x + d[0];
            const ny = bottom.y + d[1];

            if (nx == ex && ny == ey) {
                res = resolvePathToMoves({
                    x: nx,
                    y: ny,
                    d: bottom.d+1,
                    parent: bottom
                }, startChar, endChar, map);
            } else {
                if (!seen[k(nx, ny)] && map[ny] && map[ny][nx] != null) {
                    seen[k(nx, ny)] = true;
                    stack.push({
                        x: nx,
                        y: ny,
                        d: bottom.d + 1,
                        parent: bottom
                    })
                }
            }
        });
    }

    return res;
};

const possiblePath = (locations, map) => {
    let finalPath = [];
    for(var i = 0; i < locations.length-1; i++) {
        const from = locations[i];
        const to = locations[i+1];

        const path = findPath(from, to, map);
        finalPath = finalPath.concat(path);
    }
    return finalPath;
}

const findCompositePath = (locations, map) => {
    return possiblePath(['A', ...locations], map);
}

var totalComplexity = 0;

passwords.forEach((p, pi) => {
    // if (pi != 4) {
    //     return;
    // }
    const numeric = Number(/(\d+)/.exec(p.join(''))[1]);

    let phase1 = findCompositePath(p, numberPadMap);
    let phase2 = findCompositePath(phase1, directionPadMap);
    let phase3 = findCompositePath(phase2, directionPadMap);

    totalComplexity += phase3.length * numeric;
});

console.log(totalComplexity);