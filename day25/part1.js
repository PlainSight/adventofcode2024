var fs = require('fs');

var keysAndLocks = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var keys = [];
var locks = [];
var MAX_HEIGHT = 0;

keysAndLocks.forEach(kl => {
    var rows = kl.split('\r\n');
    MAX_HEIGHT = rows.length - 2;
    var heights = rows[0].split('').map(n => 0);
    if (rows[0].split('').every(c => c == '.')) {
        // key
        for(var i = 1; i < rows.length; i++) {
            for(var x = 0; x < rows[0].length; x++) {
                if (rows[i][x] == '#') {
                    heights[x] = Math.max(heights[x], rows.length - i - 1);
                }
            }
        }
        keys.push(heights);
    } else {
        // lock
        for(var i = 1; i < rows.length; i++) {
            for(var x = 0; x < rows[0].length; x++) {
                if (rows[i][x] == '#') {
                    heights[x]++;
                }
            }
        }
        locks.push(heights);
    }
})

var combinations = 0;

locks.forEach(l => {
    keys.forEach(k => {
        let good = true;
        l.forEach((v, vi) => {
            if (k[vi] + v > MAX_HEIGHT) {
                good = false;
            }
        })
        if (good) {
            combinations++;
        }
    })
})

console.log(combinations);