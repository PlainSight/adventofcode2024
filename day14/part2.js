var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var wide = 11;
var tall = 7;

if (input.length > 12) {
    wide = 101;
    tall = 103;
}

var robots = input.map(i => {
    return /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/.exec(i).slice(1).map(Number);
})

const show = () => {
    for(var y = 0; y < tall; y++) {
        var str = '';
        for (var x = 0; x < wide; x++) {
            var count = robots.filter(r => r[0] == x && r[1] == y).length;
            if (count) {
                str += count;
            } else {
                str += '.';
            }
            
        }
        console.log(str);
    }
}

var ds = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
]

let mostTouching = 0;
let mostTouchingIter = 0;

const allTouching = () => {
    let touchingCount = 0;

    robots.forEach(r => {
        let isTouching = false;
        ds.forEach(d => {
            if (!isTouching) {
                var tx = r[0] + d[0];
                var ty = r[1] + d[1];
                if(robots.find(rr => rr[0] == tx && rr[1] == ty)) {
                    touchingCount++;
                    isTouching = true;
                    return;
                }
            }
        })
    })

    if (touchingCount == mostTouching && (iters - mostTouchingIter) == (wide * tall)) {
        show();
    }

    if (touchingCount > mostTouching) {
        mostTouching = touchingCount;
        mostTouchingIter = iters;
    }
}

var iters = 0;

while(iters < wide * tall * 2) {
    allTouching();
    iters++;
    for(var r = 0; r < robots.length; r++) {
        robots[r][0] = (robots[r][0] + robots[r][2] + wide) % wide;
        robots[r][1] = (robots[r][1] + robots[r][3] + tall) % tall;
    }
}

console.log(mostTouchingIter);
