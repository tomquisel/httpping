var http = require("http");
var url = require("url");

function handler(request, response) {
    var pathname = url.parse(request.url).pathname.substr(1);
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(pathname + "\n");
    response.end();
    console.log("Handled request to /" + pathname);
}

function main() {
    var args = process.argv.splice(2);
    var port = 8888;
    if (args.length) {
        port = args[0];
    }
    http.createServer(handler).listen(port);
    console.log("Listening on port " + port);
}

main();
