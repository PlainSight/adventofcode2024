var fs = require('fs');

var buyersSecret = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(BigInt);

const nextSecret = (sec) => {
    let s = sec;
    let mul = s * 64n;
    s = s ^ mul;
    s = s % 16777216n;

    let div = s / 32n;
    s = s ^ div;
    s = s % 16777216n;

    let mul2 = s * 2048n;
    s = s ^ mul2;
    s = s % 16777216n;
    return s;
}

let sum = 0n;
buyersSecret.forEach(b => {
    var secret = b;
    for(var i = 0; i < 2000; i++) {
        secret = nextSecret(secret);
    }
    sum += secret;
})

console.log(Number(sum));