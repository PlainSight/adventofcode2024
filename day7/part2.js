var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(n => n.split(/[: ]+/g).map(x => parseInt(x)));

var currentNums = [];
var currentTarget = 0;
var currentLen = 0;

var currentTargetLength = 0;
var currentOperandLengths = [];

var funcCalls = 0;

function check(acc, index, remainingOperandLengths) {
    funcCalls++;

    if (index == currentLen) {
        return currentTarget == acc;
    }

    // early returns
    if (currentTargetLength > (acc+'').length + remainingOperandLengths) {
        return false;
    }
    if (acc > currentTarget) {
        return false;
    }
    
    else {
        return check(acc * currentNums[index], index+1, remainingOperandLengths - currentOperandLengths[index]) ? true :
            check(acc + currentNums[index], index+1, remainingOperandLengths - currentOperandLengths[index]) ? true :
            check(parseInt(acc + '' + currentNums[index]), index+1, remainingOperandLengths - currentOperandLengths[index]);
    }
}

var possible = 0;

input.forEach(i => {
    currentTarget = i[0];
    currentTargetLength = (''+currentTarget).length;
    currentNums = i;
    currentOperandLengths = currentNums.map(n => (''+n).length);

    currentLen = i.length;
    if (check(currentNums[1], 2, currentOperandLengths.slice(2).reduce((a, c) => a+c))) {
        possible += currentTarget;
    }
})

console.log(possible);