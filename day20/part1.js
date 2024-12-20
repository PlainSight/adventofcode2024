var fs = require('fs');
const { start } = require('repl');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split(''));

var distanceMap = new Array(input.length * input[0].length);

const threshold = 99;

var ds = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
];

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

const k = (x, y) => {
    if (x < 0 || y < 0 || x >= input[0].length || y >= input.length) {
        return -1;
    }
    return y * input[0].length + x;
}

const getDist = (x, y) => {
    let res = distanceMap[k(x, y)];
    if (res === undefined) {
        return -1;
    } else {
        return res;
    }
}

input.forEach((r, y) => {
    r.forEach((c, x) => {
        if (c == 'S') {
            startX = x;
            startY = y;
        }
        if (c == 'E') {
            endX = x;
            endY = y;
        }
    })
})

// flood from dest
// mark all squares with distance from dest

var distanceToGoal = 0;

const flood = () => {
    var stack = [{
        x: endX,
        y: endY,
        d: 0
    }];

    var seen = {};
    seen[endX+','+endY] = true;
    distanceMap[k(endX, endY)] = 0;

    while (stack.length) {
        var bottom = stack.shift();

        if (bottom.x == startX && bottom.y == startY) {
            distanceToGoal = bottom.d;
        }

        ds.forEach(d => {
            var nx = bottom.x + d[0];
            var ny = bottom.y + d[1];

            if (!seen[nx+','+ny] && input[ny][nx] != '#') {
                seen[nx+','+ny] = true;
                distanceMap[k(nx, ny)] = bottom.d + 1;

                stack.push({
                    x: nx,
                    y: ny,
                    d: bottom.d + 1
                })
            }
        })
    }
}

flood();

var uniqueCheats = {};

const kc = (x, y, x2, y2) => {
    return `${x},${y},${x2},${y2}`;
}

for (var x = 0; x < input[0].length; x++) {
    for (var y = 0; y < input.length; y++) {
        for (var eo = 0; eo < 2; eo++) {
            for(var ed = 2; ed <= 2; ed++) {
                var dx = 0;
                var dy = 0;
                var wcdx = 0;
                var wcdy = 0;
                if (eo == 0) {
                    dx = ed;
                    wcdx = 1;
                } else {
                    dy = ed;
                    wcdy = 1;
                }

                var wcx = x + wcdx;
                var wcy = y + wcdy;

                if (getDist(wcx, wcy) != -1) {
                    continue;
                }
    
                var x2 = x + dx;
                var y2 = y + dy;
    
                const cheatDist = dx + dy;
    
                let d1 = getDist(x, y);
                let d2 = getDist(x2, y2);
    
                let cheatSaving = Math.abs(d1 - d2) - cheatDist;
    
                if (d1 >= 0 && d2 >= 0 && cheatSaving > threshold) {
                    if (d1 > d2) {
                        uniqueCheats[kc(x,y,x2,y2)] = cheatSaving;
                    } else {
                        uniqueCheats[kc(x2,y2,x,y)] = cheatSaving;
                    }
                }
            }
        }
        // for(var dx = 0; dx < 3; dx++) {

        //     for (var dy = 0; dy < 3; dy++) {
        //         if (dx + dy >= 2 && dx + dy <= 2) {
        //             var x2 = x + dx;
        //             var y2 = y + dy;

        //             const cheatDist = dx + dy;

        //             let d1 = getDist(x, y);
        //             let d2 = getDist(x2, y2);

        //             let cheatSaving = Math.abs(d1 - d2) - cheatDist;

        //             if (d1 >= 0 && d2 >= 0 && cheatSaving > 0) {
        //                 if (d1 > d2) {
        //                     uniqueCheats[kc(x,y,x2,y2)] = cheatSaving;
        //                 } else {
        //                     uniqueCheats[kc(x2,y2,x,y)] = cheatSaving;
        //                 }
        //             }
        //         }
        //     }
        // }
    }
}

console.log(Object.entries(uniqueCheats).sort((a, b) => b[1] - a[1]));
console.log(Object.values(uniqueCheats).length);