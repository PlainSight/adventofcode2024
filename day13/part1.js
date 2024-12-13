var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');


var machines = input.map(n => n.split('\r\n'));

/*
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400
*/

var totalCost = 0;

machines.forEach(m => {
    var ba = /Button A: X\+(\d+), Y\+(\d+)/.exec(m[0]).slice(1).map(Number);
    var bb = /Button B: X\+(\d+), Y\+(\d+)/.exec(m[1]).slice(1).map(Number);
    var prize = /Prize: X=(\d+), Y=(\d+)/.exec(m[2]).slice(1).map(Number);

    var cheapestCost = Number.MAX_SAFE_INTEGER;
    var answerFound = false;

    for(var amul = 0; amul <= Math.min(Math.floor(prize[0]/ba[0]), Math.floor(prize[1]/ba[1])); amul++) {
        var bmul = Math.floor((prize[0] - ba[0]*amul) / bb[0]);
        var fx = amul*ba[0] + bmul*bb[0];
        var fy = amul*ba[1] + bmul*bb[1];
        if (fx == prize[0] && fy == prize[1] && (3*amul + bmul) < cheapestCost) {
            cheapestCost = (3*amul + bmul);
            answerFound = true;
        }
    }

    if (answerFound) {
        totalCost += cheapestCost;
    }
})

console.log(totalCost);