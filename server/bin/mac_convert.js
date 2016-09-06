#!/usr/bin/env node

var humanMAC = require('../human_mac.js');

if(process.argv.length !== 3) {
    console.error('Usage: mac_convert.js "mac address in hex or word form"');
    console.error('');
    console.error('  example: mac_convert.js "3c:97:0f:03:c2:0d"');
    console.error('  example: mac_convert.js "drain.seed.bell.arch.whip.bed"');
    process.exit(1);
}

var arg = process.argv[2];

if(arg.match(':')) {
    console.log(humanMAC.humanize(arg));
} else {
    console.log(humanMAC.macify(arg));
}
