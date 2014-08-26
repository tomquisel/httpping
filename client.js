"use strict";
var http = require("http");
var URL = require("url");
var common = require('./common');

function main() {
    var url = getUrlFromArgs();
    Pinger.start(url);
}

function getUrlFromArgs() {
    var args = process.argv.splice(2);
    if (args.length === 0) {
        console.log("Bad Args. Syntax: " + process.argv[0] + " " +
            process.argv[1] + " server:port/path");
        process.exit(0);
    }
    return "http://" + args[0];
}

var Pinger = {
    start: function(url) {
        Pinger._init();
        console.log("type Ctrl+C to exit");
        common.log("pinging " + url + "...");
        Pinger._runPingLoop(url);
    },

    _runPingLoop: function(url) {
        var nextLoop = function() { Pinger._runPingLoop(url); };
        Pinger._runOnePing(url, function(response, start) {
            Pinger._pingHandler(response, url, start);
            setTimeout(nextLoop, Math.max(0, 1000 - Pinger._lastPingInMS));
        });

        // only read data from the last request once the current request is on
        // its way. Overlapping requests keeps the socket open.
        Pinger._readLastResponse();

    },
    _runOnePing: function(url, onResponse) {
        var options = URL.parse(url);
        options.agent = Pinger._agent;
        var start = process.hrtime();
        var req = http.get(options, function (response) {
            onResponse(response, start);
        });
        req.on('error', function(e) {
            common.log('problem with request to ' + url + ' - ' + e.message);
        });
    },
    _init: function() {
        Pinger._initAgent();
        Pinger._initSignalHandlers();
    },
    _initAgent: function() {
        Pinger._agent = new http.Agent();
        // this allows us to keep one socket open indefinitely
        Pinger._agent.maxSockets = 1;
    },
    _initSignalHandlers: function() {
        process.on('SIGINT', function() {
            Pinger._printSummary();
            process.exit();
        });
    },
    _pingHandler: function(response, url, start) {
        var hrtime = process.hrtime(start);
        var pingInMS = Pinger._hrtimeToMS(hrtime);
        Pinger._pingHistory.push(pingInMS);
        common.log("ping took " + pingInMS + " ms");
        Pinger._lastHttpResponse = response;
        Pinger._lastPingInMS = pingInMS;
    },
    _hrtimeToMS: function(hrtime) {
        return hrtime[0]*1000 + hrtime[1] / 1000000;
    },
    _readLastResponse: function() {
        if (typeof(Pinger._lastHttpResponse) === 'undefined') {
            return;
        }
        Pinger._readData(Pinger._lastHttpResponse);
    },
    _readData: function(httpResponse) {
        var data = "";
        httpResponse.on('data', function(chunk) { data += chunk; });
    },
    _printSummary: function() {
        var n = Pinger._pingHistory.length;
        var min = Math.min.apply(null, Pinger._pingHistory);
        var max = Math.max.apply(null, Pinger._pingHistory);
        var mean, sum=0;
        Pinger._pingHistory.forEach(function(pingTime) {
            sum += pingTime;
        });
        mean = sum / n;
        console.log('\n' + n + ' pings, min: ' + min.toFixed(3) +
                    ' ms, mean: ' + mean.toFixed(3) + ' ms, max: ' +
                    max.toFixed(3) + ' ms');
    },
    _pingHistory: [],
    _lastHttpResponse: undefined,
    _agent: undefined,
};

main();
