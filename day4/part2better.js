const { match } = require('assert');
var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split(''));

var toFind = 'MAS'.split('');

var ds = [
    [-1,1],
    [-1,-1],
    [1,-1],
    [1,1]
];

var b = (x, y) => {
    return (x >= 0 && y >= 0 && x < input[0].length && y < input.length);
};

var masCenters = {};

for(var x = 0; x < input[0].length; x++) {
    for(var y = 0; y < input.length; y++) {
        if (input[y][x] == toFind[0]) {
            ds.forEach((d, di) => {
                var matches = true;
                toFind.slice(1).forEach((c, ci) => {
                    var xx = x + d[0]*(ci+1)
                    var yy = y + d[1]*(ci+1);

                    if (b(xx, yy) && input[yy][xx] == c) {

                    } else {
                        matches = false;
                    }
                });
                if (matches) {
                    var xx = x + d[0];
                    var yy = y + d[1];
                    masCenters[xx+','+yy] = masCenters[xx+','+yy] || 0;
                    masCenters[xx+','+yy]++;
                }
            });
        }
    }
}

console.log(Object.values(masCenters).filter(mc => mc == 2).length);