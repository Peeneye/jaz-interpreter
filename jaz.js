var loader = require('./loader'),
    JVM = require('./jvm'),
    filename = process.argv[2];

loader.load(filename, function (instructions) {
    var interpeter = new JVM(instructions);
    interpeter.run();
});