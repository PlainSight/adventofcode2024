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

const resolvePathToMoves = (end) => {
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
    return path;
}

const findPath = (startChar, endChar, map) => {
    if (startChar == endChar) {
        return [['A']];
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

    const possiblePaths = [];

    while(stack.length) {
        const bottom = stack.shift();

        ds.forEach(d => {
            const nx = bottom.x + d[0];
            const ny = bottom.y + d[1];

            if (nx == ex && ny == ey) {
                return [resolvePathToMoves({
                    x: nx,
                    y: ny,
                    d: bottom.d+1,
                    parent: bottom
                })];
                // possiblePaths.push({
                //     x: nx,
                //     y: ny,
                //     d: bottom.d+1,
                //     parent: bottom
                // });
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

    return possiblePaths.map(pp => resolvePathToMoves(pp));
};

const possiblePaths = (locations, map) => {
    if (locations.length < 2) {
        return [];
    }
    const localPaths = findPath(locations[0], locations[1], map);
    return localPaths.map(p => {
        return {
            val: p,
            children: possiblePaths(locations.slice(1), map)
        }
    })
}

const flattenPaths = (pp) => {
    const allPaths = [];
    pp.forEach(p => {
        if (p.children.length > 0) {
            const flattenedChildren = flattenPaths(p.children);
            flattenedChildren.forEach(fc => {
                allPaths.push([...p.val, ...fc])
            })
        } else {
            allPaths.push([...p.val]);
        }
    });
    return allPaths;
}

const findAllCompositePaths = (locationsArray, map) => {
    const allPaths = [];
    locationsArray.forEach(la => {
        const pp = possiblePaths(['A', ...la], map);
        const fp = flattenPaths(pp);
        allPaths.push(...fp);
    })
    const ap2 = Object.values(allPaths.map(f => f.join('')).reduce((a, c) => { a[c] = c; return a }, {})).map(v => v.split(''));
    return ap2;
}

var totalComplexity = 0;

passwords.forEach((p, pi) => {
    if (pi != 0) {
        return;
    }
    const numeric = Number(/(\d+)/.exec(p.join(''))[1]);

    let phase1 = findAllCompositePaths([p], numberPadMap);
    console.log('p1', phase1);
    
    //let phase2 = findAllCompositePaths(phase1, directionPadMap);
    //console.log('p2', phase2);
    //let phase3 = findCompositePath(['A', ...phase2], directionPadMap);

    if (pi == 100) {
        console.log(phase1.join(''));
        console.log(phase2.join(''));
        console.log(phase3.join(''), phase3.filter(x => x == 'A').length);
        const test = '<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A';
        console.log(test, test.split('').filter(x => x == 'A').length);
    }
});