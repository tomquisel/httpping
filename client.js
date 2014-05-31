// use this for keepalive instead
// http://stackoverflow.com/questions/10895901/how-to-send-consecutive-requests-with-http-keep-alive-in-node-js
var http = require("http");
var URL = require("url");

function main() {
    var args = process.argv.splice(2);
    if (args.length == 0) {
        console.log("Bad Args. Syntax: " + process.argv[0] + " " +
            process.argv[1] + " server:port/path");
        process.exit(0);
    }
    urlBase = args[0];
    url = "http://" + urlBase;
    console.log("Pinging " + url + "...");
    runOnePing(url);
}

function runOnePing(url) {
    options = URL.parse(url);
    options['headers'] = {'Connection': 'keep-alive'};
    console.log(options);
    var start = process.hrtime();
    var req = http.get(options, 
        function (res) { pingHandler(res, url, start); } );

    req.on('error', function(e) {
        console.log('problem with request to ' + url + ' - ' + e.message);
        runPingAgain(url);
    });
}

function runPingAgain(url) {
    setTimeout(function() { runOnePing(url); }, 1000);
}

function diffToFloat(diff) {
    return diff[0]/1000 + diff[1] / 1000000;
}

function pingHandler(res, url, start) {
    diff = process.hrtime(start);
    console.log("ping " + diffToFloat(diff));
    if (res.statusCode != 200) {
        console.log("status code = " + res.statusCode + " something went wrong.");
        runPingAgain(url);
        return;
    }
    var data = "";
    res.on('data', function(chunk) { data += chunk; });
    res.on('end', function() { responseDataHandler(data, url); });
}

function responseDataHandler(data, url) {
    runPingAgain(url);
}


main();
