var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('').map(Number);

var space = [];

for(var i = 0; i < input.length; i++) {
    var size = input[i];
    var id = i % 2 == 1 ? null : Math.floor(i / 2);

    for (var j = 0; j < size; j++) {
        space.push(id);
    }
}

var end = space.length;

for(var i = 0; i < space.length; i++) {
    while (end > i && space[end] == null) {
        end--;
    }

    if (space[i] == null && end > i) {
        space[i] = space[end];
        space[end] = null;
    }

}

var checksum = 0;

for(var i = 0; i < space.length; i++) {
    checksum += i * space[i];
}

console.log(checksum);