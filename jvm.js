var Program = require('./program');
var JVM = function (instructions) {
    this.program = null
    this.defs = require('./jvm-defs');
    this.state = 'normal';
    this.callParams = {};
    
    var stack = [],
        frames = [];
    
    this.push = function (val) {
        stack.push(val);
    };
    this.pop = function () {
        return stack.pop();
    };
    this.pushFrame = function (f) {
        frames.push(f);
    };
    this.popFrame = function () {
        return frames.pop();
    };
    
    this.init(instructions);
};

JVM.prototype.init = function (instructions) {
    //Need to find labels before we run the program
    var labels = {
    },
        offset = 0;
    
    instructions.forEach(function (instr, idx) { 
        if (instr.indexOf('label') !== -1) {
            var lbl = instr.trim().split(' ')[1];
            labels[lbl] = idx;
        }
    });
    
    
    //Splice them out so index points at instruction after label
    for (var lbl in labels) {
        var idx = labels[lbl] + offset;
        instructions.splice(idx, 1);
        labels[lbl] = idx;
        offset--;
    }
    
    labels.main = 0;
    
    this.program = new Program(instructions, labels);
};

JVM.prototype.run = function () {
    var instr = this.program.fetch();
    while (instr !== -1 && this.state !== 'halted') {
        var params = this.decode(instr);
        this.execute(params);
        instr = this.program.fetch();
    }
};

JVM.prototype.decode = function (instr) {
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
};

module.exports = JVM;