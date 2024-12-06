var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split(''));

var obs = {};

var gx = 0;
var gy = 0;
var d = 0;

var ds = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
];

input.forEach((r, y) => {
    r.forEach((c, x) => {
        switch(c) {
            case '#':
                obs[x+','+y] = true;
            break;
            case '^':
                gx = x;
                gy = y;
            break;
        }
    })
})

var minx = 0;
var maxx = input[0].length - 1;
var miny = 0;
var maxy = input.length - 1;

var visited = {};

while(gx <= maxx && gx >= minx && gy <= maxy && gy >= miny) {
    visited[gx+','+gy] = true;

    var nx = gx + ds[d][0];
    var ny = gy + ds[d][1];

    while (obs[nx+','+ny]) {
        d++;
        d = d % 4;
        nx = gx + ds[d][0];
        ny = gy + ds[d][1];
    }

    gx = nx;
    gy = ny;
}

console.log(Object.values(visited).length);