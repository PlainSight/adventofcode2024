var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var bytes = input.map(n => n.split(',').map(Number));

var maxx = 6;
var maxy = 6;
var takeMost = 12;

if (input.length > 25) {
    maxx = 70;
    maxy = 70;
    takeMost = 1024;
}

for(var i = takeMost; i < input.length; i++) {
    var foundPath = false;
    var byteSegment = bytes.slice(0, Math.min(bytes.length, i));

    var seen = {'0,0':1};
    
    const k = (x, y) => {
        return x+','+y;
    }
    
    byteSegment.forEach(bs => {
        seen[k(bs[0], bs[1])] = 1;
    })
    
    var stack = [{
        d: 0,
        x: 0,
        y: 0
    }];
    
    var ds = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
    ];

    while(stack.length && !foundPath) {
        var next = stack.shift();
    
        if (next.x == maxx && next.y == maxy) {
            foundPath = true;
        }
    
        ds.forEach(d => {
            var nx = next.x + d[0];
            var ny = next.y + d[1];
            
            if(nx >= 0 && ny >= 0 && nx <= maxx && ny <= maxy && !seen[k(nx, ny)]) {
                seen[k(nx, ny)] = 2;
                stack.push({
                    d: next.d+1,
                    x: nx,
                    y: ny
                })
            }
        })
    }

    if (!foundPath) {
        console.log(input[i-1]);
        return;
    }
}
