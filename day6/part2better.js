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

function runSim(ox, oy, first, iter) {
    if (obs[ko(ox, oy)] || (ox == startx && oy == starty)) {
        return false;
    }

    var gx = startx;
    var gy = starty;
    var d = 0;

    while(gx <= maxx && gx >= minx && gy <= maxy && gy >= miny) {
        if (first) {
            visited[kv(gx, gy, 0)] = iter;
        } else {
            if (visited[kv(gx, gy, d)] == iter) {
                return true;
            }
            visited[kv(gx, gy, d)] = iter;
        }

        var nx = gx + ds[d][0];
        var ny = gy + ds[d][1];

        while (obs[ko(nx, ny)] || (nx == ox && ny == oy)) {
            d++;
            d = d % 4;
            nx = gx + ds[d][0];
            ny = gy + ds[d][1];
        }

        gx = nx;
        gy = ny;
    }

    return first ? visited : false;
}


var init = runSim(-5, -5, true, 1);

var count = 0;

Object.keys(init).forEach((k, ki) => {
    var [ox, oy, d] = rk(k);
    
    if (runSim(ox, oy, false, ki+2)) {
        count++;
    }
})

console.log(count);