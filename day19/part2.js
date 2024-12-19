var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var available = input[0].split(/[, ]+/).sort((a, b) => b.length - a.length);

var patterns = input[1].split('\r\n');

var cache = {};

const canMake = (remaining) => {
    if (cache[remaining] !== undefined) {
        return cache[remaining];
    }
    if (remaining.length == 0) {
        return 1;
    }
    var ways = 0;
    for(var i = 0; i < available.length; i++) {
        var a = available[i];

        if (remaining.endsWith(a)) {
            var res = canMake(remaining.substring(0, remaining.length-a.length));
            if (res) {
                ways += res;
            }
        }
        
    }
    cache[remaining] = ways;
    return ways;
}

var total = 0;

patterns.forEach((p) => {
    total += canMake(p);
})

console.log(total);