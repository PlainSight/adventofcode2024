var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('').map(Number);

var spans = [];

var position = 0;

for (var i = 0; i < input.length; i++) {
    spans.push({ 
        p: position, 
        l: input[i], 
        id: (i % 2 == 1) ? null : Math.floor(i / 2) 
    });

    position += input[i];
}

var highestUnsortedSpanId = Math.max(...spans.map(n => n.id));

outer: for(var h = highestUnsortedSpanId; h >= 0; h--) {
    var highestUnsortedSpan = spans.find(s => s.id == h);

    for(var j = 0; j < spans.length; j++) {
        if (spans[j].id == null && spans[j].p < highestUnsortedSpan.p && spans[j].l >= highestUnsortedSpan.l) {
            // determine free space
            var remainingSpace = spans[j].l - highestUnsortedSpan.l;
            var remainingSpaceIndex = spans[j].p + highestUnsortedSpan.l;

            spans[j].id = highestUnsortedSpan.id;
            spans[j].l = highestUnsortedSpan.l;

            highestUnsortedSpan.id = null;

            if (remainingSpace > 0) {
                spans.splice(j, 0, {
                    p: remainingSpaceIndex,
                    l: remainingSpace,
                    id: null
                });
            }

            continue outer;
        }
    }
}

spans.sort((a, b) => a.p - b.p);

var checksum = 0;

spans.forEach(s => {
    if (s.id != null) {
        var min = s.p;
        var max = (s.p + s.l)-1;

        var sum = ((min + max) * (s.l)) / 2;

        checksum += (sum * s.id);
    }
});


console.log(checksum);