var Program = require('./program');
var JVMEngine = require('./jvm-engine');
var JVM = function (instructions) {
    this.engine = null;
    
    this.init(instructions);
};

JVM.prototype.init = function (instructions) {
    //Need to find labels before we run the program
    var labeler = require('./labeler'),
        labels = labeler.getLabels(instructions);
    
    var program = new Program(instructions, labels);
    this.engine = new JVMEngine(program);
};

JVM.prototype.run = function (doneCallback) {
    this.engine.run();
    doneCallback();
};

/*JVM.prototype.decode = function (instr) {
    instr = instr.trim();
    var splitIdx = instr.indexOf(" "),
        split = splitIdx === -1 ? [ instr, null ] : [ instr.slice(0, splitIdx), instr.slice(splitIdx).trim() ];
    
    return split;
};

JVM.prototype.execute = function (params) {
    var lhs = params[0],
        rhs = params[1];
    
    if (rhs) {
        if (!isNaN(rhs)) {
            rhs = +rhs;
        }
    }
    
    //console.log("Executings " + lhs + " with param: " + rhs);
    
    this.defs[lhs].call(this, rhs);
};*/

module.exports = JVM;