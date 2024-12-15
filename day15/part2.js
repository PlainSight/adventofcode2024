var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var walls = [];
var boxes = [];

var world = input[0].split('\r\n').map(n => n.split(''));

const k = (x, y) => {
    return y *2*world[0].length + x;
};

var posx = 0;
var posy = 0;

var boxid = 2;

world.forEach((r, y) => {
    r.forEach((c, x) => {
        switch(c) {
            case '#':
                walls[k(x*2, y)] = true;
                walls[k((x*2)+1, y)] = true;
                break;
            case 'O':
                boxes[k(x*2, y)] = boxid;
                boxid++;
                boxes[k((x*2)+1, y)] = boxid;
                boxid++;
                break;
            case '@':
                posx = x*2;
                posy = y;
                break;
        }
    })
})

var instructions = input[1].split('').filter(n => n != '\r' && n != '\n');

const getJoinedBox = (b) => {
    if (b == 0) {
        return 0;
    }
    return b + (b % 2 == 0 ? 1 : -1);
}

const canMove = (x, y, ox, oy) => {
    var dx = x - ox;
    if (dx != 0) {
        dx /= Math.abs(x - ox);
    }
    var dy = y - oy;
    if (dy != 0) {
        dy /= Math.abs(y - oy);
    }
    if (walls[k(x, y)]) {
        //console.log('hit wall');
        return false;
    }
    if (boxes[k(x, y)]) {
        if (dy == 0) {
            return canMove(x+dx, y, x, y);
        } else {
            var boxHit = boxes[k(x, y)];
            var otherBoxHit = getJoinedBox(boxHit);
            var obx = x + 1;
            if (otherBoxHit < boxHit) {
                var obx = x - 1;
            }

            var res1 = canMove(x, y+dy, x, y);
            var res2 = canMove(obx, y+dy, obx, y);
            return res1 && res2;
        }
    }
    return true;
}

const push = (x, y, ox, oy, putboxid = 0) => {
    if (!canMove(x, y, ox, oy)) {
        return false;
    }
    var dx = x - ox;
    if (dx != 0) {
        dx /= Math.abs(x - ox);
    }
    var dy = y - oy;
    if (dy != 0) {
        dy /= Math.abs(y - oy);
    }


    if (boxes[k(x, y)]) {
        var boxHit = boxes[k(x, y)];
        var otherBoxHit = getJoinedBox(boxHit);
        var obx = x + 1;
        if (otherBoxHit < boxHit) {
            var obx = x - 1;
        }

        push(obx+dx, y+dy, obx, y, otherBoxHit);
        boxes[k(obx, y)] = 0;
        push(x+dx, y+dy, x, y, boxHit);
        boxes[k(x, y)] = putboxid;
    }
    if (putboxid) {
        boxes[k(x, y)] = putboxid;
        // if (joinedBoxId < putboxid) {
        //     boxes[k(x-1, y)] = joinedBoxId;
        // } else {
        //     boxes[k(x+1, y)] = joinedBoxId;
        // }
    }
    return true;
};

const show = () => {
    for (var y = 0; y < world.length; y++) {
        var str = '';
        for (var x = 0; x < world[0].length*2; x++) {
            var char = ' ';
            if (walls[k(x, y)]) {
                char = '#';
            }
            if (boxes[k(x, y)]) {
                //char = boxes[k(x, y)];
                if (boxes[k(x, y)] % 2 == 0) {
                    char = '[';
                } else {
                    char = ']';
                }
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
    var result = push(newx, newy, posx, posy);
    if (result) {
        posx = newx;
        posy = newy;
    }
});

var score = (k) => {
    var x = k % (world[0].length*2);
    var y = Math.floor(k / (world[0].length*2));
    return (100 * y) + x; 
}

show();

var res = 0;

var skip = false;
for(var i = 0; i < boxes.length; i++) {
    if (skip) {
        skip = false;
    } else {
        if (boxes[i]) {
            skip = true;
            res += score(i);
        }
    }
}

console.log(res);