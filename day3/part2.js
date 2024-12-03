var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8');

var matches = input.match(/don\'t\(\)|(do\(\))|(mul\((\d+)\,(\d+)\))/g);

var sum = 0;

var active = true;

matches.forEach(m => {
    if (m == 'do()') {
        active = true;
    } else {
        if (m == 'don\'t()') {
            active = false;
        } else {
            if (active) {
                var bits = /mul\((\d+)\,(\d+)\)/.exec(m);
        
                var one = parseInt(bits[1]);
                var two = parseInt(bits[2]);
            
                sum += one * two;
            }
        }
    }
    
})

console.log(sum);