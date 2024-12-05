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

function checkOrder(p) {
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
    return good;
}

pages.filter(p => {
    var good = checkOrder(p);

    if (!good) {

        var working = [...p];

        while(!checkOrder(working)) {
            orders.forEach(o => {
                var i1 = working.indexOf(o.b);
                var i2 = working.indexOf(o.a);
                if (i1 >= 0 && i2 >= 0) {
                    if (i2 < i1) {
                        working[i1] = o.a;
                        working[i2] = o.b;
                        return;
                    }
                }
            });
        }

        res += working[Math.floor(working.length/2)];
    }
})

console.log(res);
