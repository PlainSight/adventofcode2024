var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');


var machines = input.map(n => n.split('\r\n'));

/*
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400
*/

var totalCost = 0n;

machines.forEach((m, mi) => {
    var ba = /Button A: X\+(\d+), Y\+(\d+)/.exec(m[0]).slice(1).map(BigInt);
    var bb = /Button B: X\+(\d+), Y\+(\d+)/.exec(m[1]).slice(1).map(BigInt);
    var prize = /Prize: X=(\d+), Y=(\d+)/.exec(m[2]).slice(1).map(n => BigInt(n) + 10000000000000n);

    // sub equation 1 into equation 2
    // eq1: ba[0]*amul + bb[0]*bmul = prize[0]
    // eq2: ba[1]*amul + bb[1]*bmul = prize[1]

    var eq1x1 = ba[0];
    var eq1x2 = bb[0];
    var eq1ans = prize[0];

    var eq2y1 = ba[1];
    var eq2y2 = bb[1];
    var eq2ans = prize[1];

    // make equation a - b1 + b2 = right

    var a = eq2y1 * eq1ans;
    var b1 = eq2y1 * eq1x2;
    var b2 =  eq2y2 * eq1x1;
    var right = eq2ans * eq1x1;

    right -= a;
    var b3 = b2 - b1;


    if (right % b3 == 0) {
        var b = right / b3;

        var a1 = eq1ans - (eq1x2*b);
        if (a1 % eq1x1 == 0) {
            var a = a1 / eq1x1;
            var thisCost = (3n*a + b);
            totalCost += thisCost;
        }
    }
});

console.log(totalCost);