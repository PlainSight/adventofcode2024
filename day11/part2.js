var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split(' ').map(Number);

var current = {};
var next = {};

const ins = (n, count, array = next) => {
    array[n]= array[n] || 0;
    array[n] += count;
}

input.forEach(n => {
    ins(n, 1, current);
})

for(var b = 0; b < 75; b++) {
    Object.entries(current).forEach(e => {
        const c = Number(e[0]);
        const n = Number(e[1]);

        if (c == 0) {
            ins(1, n);
        } else {
            var digits = Math.ceil(Math.log10(c + 1));
            if (digits % 2 == 0) {
                var divisor = Math.pow(10, digits/2);
                ins(Math.floor(c / divisor), n);
                ins(Math.floor(c % divisor), n);
            } else {
                ins(c * 2024, n);
            }
        }
    });

    current = next;
    next = {};
}

console.log(Object.values(current).reduce((a, c) => a+c));



