var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var reports = input.map(n => n.split(' ').map(Number));

console.log(reports);



var safe = (r) => {
    var sign = r[1] - r[0] < 0 ? -1 : 1;

    var good = r[1] - r[0] != 0;

    console.log(r, sign, good);

    for(var i = 0; i < r.length-1; i++) {
        var diff = r[i+1] - r[i];
        if (diff * sign < 0) {
            good = false;
        }
        if ((diff*sign) == 0 || (diff*sign) > 3) {
            good = false;
        }
    }

    return good;
}

console.log(reports.filter(r => safe(r)).length);