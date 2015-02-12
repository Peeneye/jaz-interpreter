var Program = require('./program');
var JVMEngine = require('./jvm-engine');
var JVMDefs = require('./jvm-defs');
var JVMPreprocessor = require('./jvm-preprocessor');
var JVM = function (instructions) {
    this.engine = null;

    this.run = function () {
        //Need to find labels before we run the program
        var tasks = ["Labels"],
            taskResults = JVMPreprocessor.runTasks(tasks).on(instructions);

        var program = new Program(instructions, taskResults["Labels"]);
        this.engine = new JVMEngine(program, JVMDefs);
        this.engine.run();
    };
};

module.exports = JVM;