var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var orders = input[0].split('\r\n').map(n => {
    var ps = n.split('|');
    return {
        b: parseInt(ps[0]),
        a: parseInt(ps[1])
    }
});

var pages = input[1].split('\r\n').map(n => n.split(',').map(x => parseInt(x)));

var res = 0;

pages.filter(p => {
    var good = true;

    orders.forEach(o => {
        var i1 = p.indexOf(o.b);
        var i2 = p.indexOf(o.a);
        if (i1 >= 0 && i2 >= 0) {
            if (i2 < i1) {
                good = false;
            }
        }
    });

    if (good) {
        res += p[Math.floor(p.length/2)];
    }

})

console.log(res);
