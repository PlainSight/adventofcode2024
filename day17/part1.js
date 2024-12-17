var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8');

var matches = /Register A: (\d+)\r\nRegister B: (\d+)\r\nRegister C: (\d+)\r\n\r\nProgram: ([\d,]+)/.exec(input).slice(1);

var A = Number(matches[0]);
var B = Number(matches[1]);
var C = Number(matches[2]);

var prog = matches[3].split(',').map(Number);

const getCombo = (operand) => {
    if (operand < 4) {
        return operand;
    } else {
        switch(operand) {
            case 4:
                return A;
            case 5:
                return B;
            case 6: 
                return C;
            case 7:
                throw 'Invalid COMBO';
        }
    }
}

var output = [];

for(var pc = 0; pc < prog.length; pc += 2) {
    var instr = prog[pc];
    var operand = prog[pc+1];
    switch (instr) {
        case 0: //adv
            A = Math.floor(A / Math.pow(2, getCombo(operand)));
            break;
        case 1: //bxl
            B = B ^ operand;
            break;
        case 2: //bst
            B = getCombo(operand) % 8;
            break;
        case 3: //jnz
            if (A != 0) {
                pc = operand;
                pc -= 2; // to account for normal increment
            }
            break;
        case 4: //bxc
            B = B ^ C;
            break;
        case 5: //out
            output.push(getCombo(operand) % 8);
            break;
        case 6: //bdv
            B = Math.floor(A / Math.pow(2, getCombo(operand)));
            break;
        case 7: //cdv
            C = Math.floor(A / Math.pow(2, getCombo(operand)));
            break;
    }
}

console.log(output.join(','));