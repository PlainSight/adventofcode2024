var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split(/[: ]+/g).map(x => parseInt(x)));

var possible = 0;

function check(ans, acc, remaining) {
    if (remaining.length == 0) {
        return ans == acc;
    }
    else {
        var mul = check(ans, acc * remaining[0], remaining.slice(1));
        var add = check(ans, acc + remaining[0], remaining.slice(1));
        return mul || add;
    }
}

input.forEach(i => {
    var a = i[0];
    var first = i[1];
    var others = i.slice(2);
    if (check(a, first, others)) {
        possible += a;
    }
})

console.log(possible);