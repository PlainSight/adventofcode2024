var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(l => l.split(/[ ]+/));

var left = input.map(i => parseInt(i[0])).sort();
var right = input.map(i => parseInt(i[1])).sort();

var score = 0;

left.forEach((l) => {
    var occurs = 0;

    right.forEach(r => {
        if (l == r) {
            occurs++;
        }
    });

    score += occurs * l;
})

console.log(score);