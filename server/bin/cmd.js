#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var ssh2 = require('ssh2');
var buffersEqual = require('buffer-equal-constant-time');
var ndjson = require('ndjson');

var settings = require('../settings.js');

function log(str) {
    console.log(str);
}

function logError(str) {
    console.error(str);
}

/*
var clients = {};

function Client(client, session) {
    this.client = client;
    this.session = session;
    this.id = undefined;

    this.outStream = null;
    this.inStream = null;

    this.client.on('end', function() {
        if(clients[this.id]) {
            log("client " + this.id + " disconnected");
            delete clients[this.id];
        }
    }.bind(this));

    this.session.on('exec', function(accept, reject, info) {
        var m;
        console.log("got command:", info.command);
        if(m = info.command.match(/^makenode/)) {
            var stream = accept();

            log("got makenode command");
        } else {
            console.error("bad command");
            reject();
            return;
        }
    }.bind(this));

    this.msgChannelCmd = function(stream) {
        log("message channel opened");
        
        this.inStream = stream.pipe(ndjson.parse());

        this.inStream.on('data', function(msg) {
            if(msg.type === 'ipk_request') {
                this.sendIPK();
            } else {
                log("Received unknown message with type: " + String(type));
                return;
            }
        }.bind(this));
    };

    this.sendIPK = function() {
        console.error("sendIPK not implemented");
        this.outStream.write("foo bar baz");
    };

}
*/
var makenodeServer = {

    start: function(settings, opts, cb) {
        if(typeof opts === 'function') {
            cb = opts;
            opts = {};
        }

        if(!settings.keys.priv || !settings.keys.pub) return cb("Missing private or public host key. Server not started.");
        
//        var pubKey = ssh2.utils.genPublicKey(ssh2.utils.parseKey(fs.readFileSync(settings.keys.pub)));
        
        var serv = new ssh2.Server({
            hostKeys: [fs.readFileSync(settings.keys.priv)]
        }, function(client) {
            log('client connected!');

/*
            client.on('error', function(err) {
                log('error:', err);
            });
            
            client.on('authentication', function(ctx) {
                log("authentication");
                if(ctx.method === 'publickey') {
//                    if(ctx.key.algo === pubKey.fulltype && buffersEqual(ctx.key.data, pubKey.public)) {
                        ctx.accept();
                        return;
//                    }
                }
                ctx.reject();
            });
            
            client.on('ready', function() {
                log('client authenticated!');
                
                client.on('session', function(accept, reject) {
                    var session = accept();
                    log("session accepted");

                    var c = new Client(client, session)

                });
            });

            client.on('end', function() {
                log("client disconnected");
            });
*/
            
        });

        serv.listen(settings.port, settings.hostname, function() {
            log("listening on "+settings.hostname+":"+settings.port);
            cb();
        });
    }

};




makenodeServer.start(settings, function(err) {
    if(err) {
        console.error(err);
        process.exit(1);
    }
});
