var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(l => l.split(/[ ]+/));

var first = input.map(i => parseInt(i[0])).sort();
var second = input.map(i => parseInt(i[1])).sort();

console.log(first, second);

var dist = 0;

first.forEach((f, fi) => {
    dist += Math.abs(f - second[fi]);
})

console.log(dist);