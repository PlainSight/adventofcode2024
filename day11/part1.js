var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split(' ').map(Number);

var current = input;
var next = [];

for(var b = 0; b < 25; b++) {
    current.forEach(c => {
        if (c == 0) {
            next.push(1);
        } else {
            var digits = Math.ceil(Math.log10(c + 1));
            if (digits % 2 == 0) {
                var divisor = Math.pow(10, digits/2);
                next.push(Math.floor(c / divisor));
                next.push(Math.floor(c % divisor));
            } else {
                next.push(c * 2024);
            }
        }
    });

    current = next;
    next = [];
}

console.log(current.length);



