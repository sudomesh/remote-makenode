
var fs = require('fs');

var lines = fs.readFileSync('wordlist').toString().split('\n');

// convert a number to a two-digit hex string
function toHexStr(val) {
    var str = val.toString(16);
    if(str.length === 1) {
        str = '0'+str;
    }
    return str;
}

function clean(str) {
    return str.toLowerCase().replace(/\s+/, '');
}

function hexToWord(hex) {
    if(typeof hex === 'string') {
        hex = parseInt(hex, 16);
    }
    if(typeof hex !== 'number') {
        throw new Error("Attempting to convert non-number to word");
    }
    if(hex < 0 || hex > 255) {
        throw new Error("MAC address hex value out of bounds");
    }
    return clean(lines[hex]);
}

function wordToHex(word) {
    if(typeof word !== 'string') {
        throw new Error("Attempting to convert non-string to hex value");
    }
    word = clean(word);
    var i, cur;
    for(i=0; i < lines.length; i++) {
        cur = clean(lines[i]);
        if(cur == word) {
            return toHexStr(i);
        }
    }
    throw new Error("Invalid word. Cannot convert to hex");
}

module.exports = {

    humanize: function(mac) {
        var vals = mac.split(':');
        if(vals.length != 6) {
            throw new Error("Invalid MAC address: Does not have six fields");
        }
        var words = [];
        var i;
        for(i=0; i < vals.length; i++) {
            words.push(hexToWord(vals[i]));
        }

        return words.join('.');
    },
    
    macify: function(words) {

        words = words.split(/[\.\n]/);
        if(words.length != 6) {
            throw new Error("There must be six words to make up a MAC address but I only got " + words.length);
        }

        var mac = [];
        var i;
        for(i=0; i < words.length; i++) {
            words[i] = clean(words[i]);
            mac.push(wordToHex(words[i]));
        }
        
        return mac.join(':');
    }
}
