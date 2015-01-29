module.exports = {
    load: function (filename, callback) {
        var fs = require('fs'),
            liner = require('./liner'),
            source = fs.createReadStream(filename),
            instructions = [];
        
        source.pipe(liner);
        liner.on('readable', function () {
            var line;
            while (line = liner.read()) {
                instructions.push(line);
            }
        });

        liner.on('end', function () {
            callback(instructions);
        });
    }
};