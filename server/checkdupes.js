#!/usr/bin/env node

var fs = require('fs');

var lines = fs.readFileSync('wordlist').toString().split('\n');

console.log("Checking wordlist for duplicate words");

var dupes = false;
var i, j, wordI, wordJ;
for(i=0; i < lines.length; i++) {
    for(j=0; j < lines.length; j++) {
        if(i === j) continue;
        wordI = lines[i].toLowerCase().replace(/\s+/, '');
        wordJ = lines[j].toLowerCase().replace(/\s+/, '');
        if(!wordI) {
            console.log("EMPTY OR INVALID ENTRY ON LINE:", i);
        }
        if(!wordJ) {
            console.log("EMPTY OR INVALID ENTRY ON LINE:", j);
        }

        if(wordI == wordJ) {
            console.log("DUPLICATE FOUND ON LINE", i, "and", j, lines[i]);
            dupes = true;
        }
    }
}

if(!dupes) {
    console.log("No duplicates found.");
}

console.log("Total number of words:", lines.length);

