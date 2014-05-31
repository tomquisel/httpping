module.exports = {
    log: function(s) {
        var time = (Date.now() / 1000).toFixed(3);
        console.log(time + ": " + s);
    }
}
