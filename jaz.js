var loader = require('./loader'),
    JVM = require('./jvm'),
    filename = process.argv[2];

loader.load(filename, function (instructions) {
    var interpeter = new JVM(instructions),
        startTime = new Date().getTime(),
        endTime = null;
    interpeter.run(function () {
        endTime = new Date().getTime();
        var diff = endTime - startTime;
        console.log("Execution Completed In " + diff + "ms");
    });
});