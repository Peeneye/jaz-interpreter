var Stack = require('./stack'),
    JVMDefs = require('./jvm-defs');
var JVMEngine = function (program, definitions) {
    this.program = program;
    this.definitions = JVMDefs;
    this.state = '';
    
    var stack = new Stack(),
        frames = new Stack();
    
    this.push = stack.push;
    this.pop = stack.pop;
    
    this.pushFrame = frames.push;
    this.popFrame = frames.pop;
};

var decode = function (instr) {
    instr = instr.trim();
    var splitIdx = instr.indexOf(" "),
        split = splitIdx === -1 ? [ instr, null ] : [ instr.slice(0, splitIdx), instr.slice(splitIdx).trim() ];
    
    return split;
};

var execute = function (params) {
    var lhs = params[0],
        rhs = params[1];
    
    if (rhs) {
        if (!isNaN(rhs)) {
            rhs = +rhs;
        }
    }
    
    
    if (this.definitions[lhs]) {
        this.definitions[lhs].call(this, rhs);
    } else {
        throw 'Invalid keyword';
    }
};



JVMEngine.prototype.run = function () {
    var instr = this.program.fetch();
    while (instr !== -1 && this.state !== 'halted') {
        var params = decode(instr);
        execute.call(this, params);
        instr = this.program.fetch();
    }
};

module.exports = JVMEngine;