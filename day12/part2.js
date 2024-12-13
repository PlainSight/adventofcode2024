var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split(''));

var seen = new Array(input.length * input[0].length);

const k = (x, y) => {
    if (!inBounds(x, y)) {
        return -1;
    }
    return y * input[0].length + x;
}

const beenSeen = (x, y) => {
    return !!seen[k(x, y)];
}

const inBounds = (x, y) => {
    return x >= 0 && x < input[0].length && y >= 0 && y < input.length;
}

var ds = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1]
];

const floodArea = (x, y, c, seenNumber) => {
    if (!inBounds(x, y)) {
        return 0;
    }
    if (input[y][x] != c) {
        return 0;
    }
    seen[k(x, y)] = seenNumber;
    var area = 1;
    ds.forEach(d => {
        var xx = x + d[0];
        var yy = y + d[1];

        if (!beenSeen(xx, yy)) {
            var ca = floodArea(xx, yy, c, seenNumber);
            if (ca != 0) {
                area += ca;
            }
        }
    });
    return area;
}

const countSides = (seenNumber) => {
    var horizontalLines = [];
    var verticalLines = [];
    for(var x = 0; x < input[0].length; x++) {
        for (var y = -1; y < input.length; y++) {
            // find horizontal lines
            if (seen[k(x, y)] != seen[k(x, y+1)] && (seen[k(x, y)] == seenNumber || seen[k(x, y+1)] == seenNumber)) {
                var handedness = 0;
                if (seen[k(x, y)] == seenNumber) {
                    handedness = 1
                }                

                horizontalLines.push([x, y, handedness]);
            }
        }
    }

    for (var y = 0; y < input.length; y++) {
        for(var x = -1; x < input[0].length; x++) {
            // find vertical lines
            if (seen[k(x, y)] != seen[k(x+1, y)] && (seen[k(x, y)] == seenNumber || seen[k(x+1, y)] == seenNumber)) {
                var handedness = 0;
                if (seen[k(x, y)] == seenNumber) {
                    handedness = 1
                }          
                verticalLines.push([x, y, handedness]);
            }
        }
    }

    // now combine horizontal and vertical lines
    var hsides = 0;

    horizontalLines.forEach((hl, hli) => {
        if (hli == 0) {
            hsides++;
            return;
        } else {
            var hasNeighbour = false;
            horizontalLines.forEach((hlc, hlci) => {
                if (hlci >= hli) {
                    return;
                }
                if (hl[1] == hlc[1] && hl[0] - 1 == hlc[0] && hl[2] == hlc[2]) {
                    hasNeighbour = true;
                }
            });
            if (!hasNeighbour) {
                // its a new side
                hsides++;
            }
        }
    })

    var vsides = 0;

    verticalLines.forEach((vl, vli) => {
        if (vli == 0) {
            vsides++;
            return;
        } else {
            var hasNeighbour = false;
            verticalLines.forEach((vlc, vlci) => {
                if (vlci >= vli) {
                    return;
                }
                if (vl[0] == vlc[0] && vl[1] - 1 == vlc[1] && vl[2] == vlc[2]) {
                    hasNeighbour = true;
                }
            });
            if (!hasNeighbour) {
                // its a new side
                vsides++;
            }
        }
    })

    //console.log('horizontalLines', horizontalLines);
    //console.log('hsides', hsides);
    //console.log('verticalLines', verticalLines);
    //console.log('vsides', vsides);
    return hsides + vsides;
}

var cost = 0;
var seenNumber = 1;

for(var x = 0; x < input[0].length; x++) {
    for (var y = 0; y < input.length; y++) {
        if (!beenSeen(x, y)) {
            var character = input[y][x];
            var area = floodArea(x, y, character, seenNumber);

            var sides = countSides(seenNumber);

            //console.log('res', character, area, sides, area * sides);

            seenNumber++;

            cost += (area * sides);
        }
    }
}

console.log(cost);
