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

var startx = 0;
var starty = 0;

input.forEach((r, y) => {
    r.forEach((c, x) => {
        switch(c) {
            case '#':
                obs[x+','+y] = true;
            break;
            case '^':
                startx = x;
                starty = y;
            break;
        }
    })
})

var minx = 0;
var maxx = input[0].length - 1;
var miny = 0;
var maxy = input.length - 1;

var count = 0;

for (var ox = minx-1; ox <= maxx+1; ox++) {
 mid:   for (var oy = miny-1; oy <= maxy+1; oy++) {
        if (obs[ox+','+oy] || (ox == startx && oy == starty)) {
            continue mid;
        }

        var gx = startx;
        var gy = starty;
        var d = 0;

        var visited = {};

        while(gx <= maxx && gx >= minx && gy <= maxy && gy >= miny) {
            if (visited[gx+','+gy] == d+5) {
                count++;
                console.log(ox, oy);
                continue mid;
            }
            visited[gx+','+gy] = d+5;

            var nx = gx + ds[d][0];
            var ny = gy + ds[d][1];

            while (obs[nx+','+ny] || (nx == ox && ny == oy)) {
                d++;
                d = d % 4;
                nx = gx + ds[d][0];
                ny = gy + ds[d][1];
            }

            gx = nx;
            gy = ny;
        }
    }
}

console.log(count);

