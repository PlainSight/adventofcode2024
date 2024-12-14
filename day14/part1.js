var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var wide = 11;
var tall = 7;

if (input.length > 12) {
    wide = 101;
    tall = 103;
}

var midx = Math.floor(wide / 2); 
var midy = Math.floor(tall / 2); 

var robots = input.map(i => {
    return /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/.exec(i).slice(1).map(Number);
})

const show = () => {
    for(var y = 0; y < tall; y++) {
        var str = '';
        for (var x = 0; x < wide; x++) {
            var count = robots.filter(r => r[0] == x && r[1] == y).length;
            if (x == midx) {
                str += ' ';
            } else {
                if (y == midy) {
                    str += ' ';
                } else {
                    if (count) {
                        str += count;
                    } else {
                        str += '.';
                    }
                }
            }
            
        }
        console.log(str);
    }
}

for(var t = 0; t < 100; t++) {
    for(var r = 0; r < robots.length; r++) {
        robots[r][0] = (robots[r][0] + robots[r][2] + wide) % wide;
        robots[r][1] = (robots[r][1] + robots[r][3] + tall) % tall;
    }
}

show();

var quadrantMults = [0, 0, 0, 0];

robots.forEach(r => {
    if (r[0] == midx || r[1] == midy) {
        return;
    }
    var index = 0;
    if (r[0] < midx) {
        index += 2;
    }
    if (r[1] < midy) {
        index++;
    }
    quadrantMults[index]++;
});

console.log(quadrantMults.reduce((a, c) => a * c, 1));
