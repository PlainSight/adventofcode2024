var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var bytes = input.map(n => n.split(',').map(Number));

var maxx = 6;
var maxy = 6;

if (input.length > 25) {
    maxx = 70;
    maxy = 70;
}

const combineAttr = (a1, a2) => {
    return [...a1, ...a2].sort().reduce((a, c) => {
        if (!a.includes(c)) {
            a.push(c);
        }
        return a;
    }, []);
}

const groupItems = (x1, x2) => {
    x1Set = x1;
    x2Set = x2;
    // find parent sets 
    while (x1Set.parent) {
        x1Set = x1Set.parent;
    }

    while (x2Set.parent) {
        x2Set = x2Set.parent;
    }

    if (x1Set != x2Set) {
        // find largest set
        var largestSet = x2Set;
        var smallestSet = x1Set;

        if (x1Set.size > x2Set.size) {
            largestSet = x1Set;
            smallestSet = x2Set;
        }

        largestSet.attr = combineAttr(largestSet.attr, smallestSet.attr);
        largestSet.size += smallestSet.size;

        smallestSet.parent = largestSet;
    }
}

var locations = new Array((maxx+1) * (maxy+1));

const k = (x, y) => {
    return y * (maxx+1) + x;
}

var ds = [
    [1, 0],
    [1, 1],
    [1, -1],
    [-1, 0],
    [-1, 1],
    [-1, -1],
    [0, 1],
    [0, -1]
];

for(var i = 0; i < bytes.length; i++) {
    var o = bytes[i];
    
    // make new set
    var newSet = {
        attr: [],
        parent: null,
        size: 1
    }

    if (o[0] == 0) {
        newSet.attr.push(1)
    }
    if (o[0] == maxx) {
        newSet.attr.push(3)
    }
    if (o[1] == 0) {
        newSet.attr.push(2)
    }
    if (o[1] == maxy) {
        newSet.attr.push(4)
    }

    locations[k(o[0], o[1])] = newSet;

    ds.forEach(d => {
        var nx = o[0] + d[0];
        var ny = o[1] + d[1];
        if (nx >= 0 && ny >= 0 && nx <= maxx && ny <= maxy) {
            var neighbour = locations[k(nx, ny)];
            if (neighbour) {
                groupItems(newSet, neighbour);
            }
        }
    });

    var ultimateSet = newSet;
    while (ultimateSet.parent) {
        ultimateSet = ultimateSet.parent;
    }
    if (ultimateSet.attr.length > 2 || (ultimateSet.attr.length == 2 && ultimateSet.attr.reduce((a, c) => a + c, 0) % 2 == 0)) {
        console.log(o.join(','));
        return;
    }
}
