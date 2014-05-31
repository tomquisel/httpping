"use strict";
var http = require("http");
var url = require("url");
var common = require('./common');

function main() {
    var port = getPortFromArgs();
    http.createServer(handler).listen(port);
    common.log("listening on port " + port);
}

function getPortFromArgs() {
    var args = process.argv.splice(2);
    var port = 8888;
    if (args.length) {
        port = args[0];
    }
    return port;
}

function handler(request, response) {
    var pathname = url.parse(request.url).pathname.substr(1);
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(pathname + "\n");
    response.end();
    common.log("handled request to /" + pathname);
}

main();
