var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var bytes = input.map(n => n.split(',').map(Number));

var maxx = 6;
var maxy = 6;

if (input.length > 25) {
    maxx = 70;
    maxy = 70;
}

const groupItems = (x1, x2) => {
    x1Set = x1.set;
    x2Set = x2.set;
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

        largestSet.attr = largestSet.attr | smallestSet.attr;
        largestSet.size += smallestSet.size;

        smallestSet.parent = largestSet;

        x1.set = largestSet;
        x2.set = largestSet;
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

const blockedConditions = [
    3, // horizontal    0011
    12, // vertical     1100
    5, // top left      0101
    10 // bottom right  1010
]

for(var i = 0; i < bytes.length; i++) {
    var o = bytes[i];
    
    // make new set
    var newSet = {
        attr: 0,
        parent: null,
        size: 1
    }

    if (o[0] == 0) {
        newSet.attr |= 1; //0001
    }
    if (o[0] == maxx) {
        newSet.attr |= 2; //0010
    }
    if (o[1] == 0) {
        newSet.attr |= 4; //0100
    }
    if (o[1] == maxy) {
        newSet.attr |= 8; //1000
    }

    const newByte = {
        set: newSet
    };

    locations[k(o[0], o[1])] = newByte;

    ds.forEach(d => {
        var nx = o[0] + d[0];
        var ny = o[1] + d[1];
        if (nx >= 0 && ny >= 0 && nx <= maxx && ny <= maxy) {
            var neighbour = locations[k(nx, ny)];
            if (neighbour) {
                groupItems(newByte, neighbour);
            }
        }
    });

    if (blockedConditions.some(bc => (bc & newByte.set.attr) == bc)) {
        console.log(o.join(','));
        break;
    }
}
