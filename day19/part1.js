var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var available = input[0].split(/[, ]+/).sort((a, b) => b.length - a.length);

var patterns = input[1].split('\r\n');

const canMake = (remaining) => {
    if (remaining.length == 0) {
        return true;
    }
    for(var i = 0; i < available.length; i++) {
        var a = available[i];
        if (remaining.endsWith(a)) {
            var res = canMake(remaining.substring(0, remaining.length-a.length));
            if (res) {
                return true;
            }
        }
        
    }
    return false;
}

var total = 0;

patterns.forEach((p) => {
    if (canMake(p)) {
        total++;
    }
})

console.log(total);