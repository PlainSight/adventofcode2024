var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var reports = input.map(n => n.split(' ').map(Number));

var checkGood = (r) => {
    var sign1 = r[1] - r[0] < 0 ? -1 : 1;
    var sign2 = r[2] - r[1] < 0 ? -1 : 1;
    var sign3 = r[3] - r[2] < 0 ? -1 : 1;

    var sign = sign1 + sign2 + sign3 < 0 ? -1 : 1;

    var badIndexes = {};
    var badCount = 0;
    var good = true;

    for(var i = 0; i < r.length-1; i++) {
        var diff = r[i+1] - r[i];
        if (diff * sign < 0) {
            good = false;
            badCount++;
            badIndexes[i] = i;
            badIndexes[i+1] = i+1;
            continue;
        }
        if ((diff*sign) == 0 || (diff*sign) > 3) {
            good = false;
            badCount++;
            badIndexes[i] = i;
            badIndexes[i+1] = i+1;
            continue;
        }
    }

    return [good, badIndexes, badCount];
}

var safe = (r) => {
    var [good, badIndexes, badCount] = checkGood(r);

    var redeemed = false;

    if (!good && badCount <= 2) {
        Object.values(badIndexes).forEach(bi => {
            var derp;
            [good, derp, badCount] = checkGood([...r.slice(0, bi), ...r.slice(bi+1)]);
            if (good) {
                redeemed = true;
            }
        });
    }

    return good || redeemed;
}

console.log(reports.filter(r => safe(r)).length);