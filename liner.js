var stream = require('stream');
var liner = new stream.Transform( { objectMode: true } ),
    delim = '\n';
liner._transform = function (chunk, encoding, done) {
    var data = chunk.toString();
    if (data.indexOf('\r') !== -1) {
        delim = '\r\n';
    }
    if (this._lastLineData) {
        data = this._lastLineData + data;
    }
    
    var lines = data.split(delim);
    this._lastLineData = lines.splice(lines.length - 1, 1)[0];
    
    lines.forEach(this.push.bind(this));
    done();
};

liner._flush = function (done) {
    if (this._lastLineData) {
        this.push(this._lastLineData);
    }
    this._lastLineData = null;
    done();
};

module.exports = liner;