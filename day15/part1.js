var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var walls = [];
var boxes = [];

var world = input[0].split('\r\n').map(n => n.split(''));

const k = (x, y) => {
    return y * world[0].length + x;
};

var posx = 0;
var posy = 0;

world.forEach((r, y) => {
    r.forEach((c, x) => {
        switch(c) {
            case '#':
                walls[k(x, y)] = true;
                break;
            case 'O':
                boxes[k(x, y)] = true;
                break;
            case '@':
                posx = x;
                posy = y;
                break;
        }
    })
})

var instructions = input[1].split('').filter(n => n != '\r' && n != '\n');

const moveAndPush = (x, y, putbox) => {
    //console.log('mAP call', x, y, putbox);
    var dx = x - posx;
    if (dx != 0) {
        dx /= Math.abs(x - posx);
    }
    var dy = y - posy;
    if (dy != 0) {
        dy /= Math.abs(y - posy);
    }
    if (walls[k(x, y)]) {
        //console.log('hit wall');
        return false;
    }
    if (boxes[k(x, y)]) {
        //console.log('hit box', x, y);
        //console.log('trying to push to', x+dx, y+dy)
        var res = moveAndPush(x+dx, y+dy, true);
        //console.log((res ? 'can' : 'can\'t') + ' push');
        if (res) {
            boxes[k(x, y)] = !!putbox;
        }
        return res;
    }
    if (putbox) {
        boxes[k(x, y)] = true;
    }
    return true;
};

const show = () => {
    for (var y = 0; y < world.length; y++) {
        var str = '';
        for (var x = 0; x < world[0].length; x++) {
            var char = ' ';
            if (walls[k(x, y)]) {
                char = '#';
            }
            if (boxes[k(x, y)]) {
                char = 'O';
            }
            if (y == posy && x == posx) {
                char = '@';
            }
            str += char;
        }
        console.log(str);
    }
}


instructions.forEach(i => {
    var newx = posx;
    var newy = posy;
    switch(i) {
        case '<':
            newx = posx-1;
            break;
        case '>':
            newx = posx+1;
            break;
        case '^':
            newy = posy-1;
            break;
        case 'v':
            newy = posy+1;
            break;
    }
    var result = moveAndPush(newx, newy);
    if (result) {
        posx = newx;
        posy = newy;
    }
});

var score = (k) => {
    var x = k % world[0].length;
    var y = Math.floor(k / world[0].length);
    return (100 * y) + x; 
}

show();

var res = 0;

for(var i = 0; i < boxes.length; i++) {
    if (boxes[i]) {
        res += score(i);
    }
}

console.log(res);