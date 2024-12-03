var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8');

var matches = input.match(/mul\((\d+)\,(\d+)\)/g);

var sum = 0;

matches.forEach(m => {
    var bits = /mul\((\d+)\,(\d+)\)/.exec(m);

    var one = parseInt(bits[1]);
    var two = parseInt(bits[2]);

    sum += one * two;
})

console.log(sum);