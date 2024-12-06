const { fail } = require('assert');
var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split(''));

var obs = {};

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

var startx = 0;
var starty = 0;

const k = (x, y) => {
    return y*(maxx+3) + x+1; // padded
}

const rk = (v) => {
    var x1 = v % (maxx+3);
    var y = Math.floor(v / (maxx+3));
    return [ x1-1, y];
}

input.forEach((r, y) => {
    r.forEach((c, x) => {
        switch(c) {
            case '#':
                obs[k(x, y)] = true;
            break;
            case '^':
                startx = x;
                starty = y;
            break;
        }
    })
})

function runSim(ox, oy, first) {
    if (obs[k(ox, oy)] || (ox == startx && oy == starty)) {
        return false;
    }

    var gx = startx;
    var gy = starty;
    var d = 0;

    var visited = {};

    while(gx <= maxx && gx >= minx && gy <= maxy && gy >= miny) {
        if (visited[k(gx, gy)] == d+5) {
            return true;
        }
        visited[k(gx, gy)] = d+5;

        var nx = gx + ds[d][0];
        var ny = gy + ds[d][1];

        while (obs[k(nx, ny)] || (nx == ox && ny == oy)) {
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


var init = runSim(-5, -5, true);

var count = 0;

Object.keys(init).forEach(k => {
    var [ox, oy] = rk(k);
    
    if (runSim(ox, oy)) {
        count++;
    }
})

console.log(count);