var fs = require('fs');
const { start } = require('repl');

var input = fs.readFileSync('./input.txt', 'utf8');

var matches = /Register A: (\d+)\r\nRegister B: (\d+)\r\nRegister C: (\d+)\r\n\r\nProgram: ([\d,]+)/.exec(input).slice(1);

var startA = Number(matches[0]);
var startB = Number(matches[1]);
var startC = Number(matches[2]);

var prog = matches[3].split(',').map(Number);

let answers = [];

const search = (e, acc) => {
    if (e < 0) {
        answers.push(acc);
        return;
    }

    var requiredB = prog[e];

    var posAns = [];

    for(var A = 0; A < 8; A++) {
        var B = A;
        var C = 0;
        B = B ^ 2;
        C = Math.floor(((8*acc)+A) / Math.pow(2, B)) % 8;
        B = B ^ 7; // inversion
        B = B ^ C;

        if (B % 8 == requiredB) {
            posAns.push(A);
        }
    }

    posAns.forEach(pa => {
        let newacc = (acc * 8) + pa;
        search(e-1, newacc);
    });
}

search(prog.length-1, 0);

console.log(Math.min(...answers));