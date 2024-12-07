const { fail } = require('assert');
var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split(''));

var ds = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
];

var minx = 0;
var maxx = input[0].length - 1;
var miny = 0;
var maxy = input.length - 1;

var obs = new Array(input.length*input[0].length);

var startx = 0;
var starty = 0;

const ko = (x, y) => {
    return y*(maxx+3) + x+1; // padded
}

const kv = (x, y, d = 0) => {
    return 4*(y*(maxx+3) + x+1) + d; // padded
}

const rk = (v) => {
    var d = v % 4;
    v = Math.floor(v / 4);
    var x1 = v % (maxx+3);
    var y = Math.floor(v / (maxx+3));
    return [ x1-1, y, d];
}

input.forEach((r, y) => {
    r.forEach((c, x) => {
        switch(c) {
            case '#':
                obs[ko(x, y)] = true;
            break;
            case '^':
                startx = x;
                starty = y;
            break;
        }
    })
});

var visited = new Array(4*input.length*input[0].length);

function runSim(ox, oy, first, iter, sx, sy, sd) {
    var gx = sx;
    var gy = sy;
    var d = sd;

    var path = [];

    while(gx <= maxx && gx >= minx && gy <= maxy && gy >= miny) {
        if (first) {
            path.push(kv(gx, gy, d));
        }

        var nx = gx + ds[d][0];
        var ny = gy + ds[d][1];

        var turned = false;

        while (obs[ko(nx, ny)] || (nx == ox && ny == oy)) {
            d++;
            d = d % 4;
            nx = gx + ds[d][0];
            ny = gy + ds[d][1];
            turned = true;
        }

        if (turned) {
            if (visited[kv(gx, gy, d)] == iter) {
                return true;
            }
            visited[kv(gx, gy, d)] = iter;
        }

        gx = nx;
        gy = ny;
    }

    return first ? path : false;
}

var init = runSim(-1, -1, true, 1, startx, starty, 0);

var count = 0;

var seen = new Array(input.length*input[0].length);
seen[ko(startx, starty)] = true;

// skip the first step as that is the start pos
for(var ki = 1; ki < init.length; ki++) {
    const k = init[ki];
    var [ox, oy, _] = rk(k);
    [sx, sy, sd] = rk(init[ki-1]);

    // we only collide with it the first time we cross paths with it regardless of direction.
    if (!seen[ko(ox, oy)]) {
        if (runSim(ox, oy, false, ki+1, sx, sy, sd)) {
            count++;
        }
    }
    seen[ko(ox, oy)] = true;
}

console.log(count);