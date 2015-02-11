var Stack = require('./stack'),
    JazDefsFactory = require('./jvm-defs'),
    StateMachine = require('./state-machine'),
    JVMStates = require('./jvm-states');

var JVMEngine = function (program, definitions) {
    this.program = program;
    this.definitions = JazDefsFactory.loadDefinitions(this);
    
    var stack = new Stack(),
        frames = new Stack(),
        stateMachine = new StateMachine();
    
    this.push = stack.push;
    this.pop = stack.pop;
    
    this.pushFrame = frames.push;
    this.popFrame = frames.pop;
    
    this.getState = stateMachine.getState;
    this.setState = stateMachine.setState;
};

var decode = function (instr) {
    instr = instr.trim();
    var splitIdx = instr.indexOf(" "),
        split = splitIdx === -1 ? [ instr, null ] 
    : [ instr.slice(0, splitIdx), instr.slice(splitIdx).trim() ];
    
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
        this.definitions[lhs](rhs);
    } else {
        throw 'Invalid keyword';
    }
};



JVMEngine.prototype.run = function () {
    var instr = this.program.fetch();
    while (instr !== -1 && this.getState() !== JVMStates.HALTED) {
        var params = decode(instr);
        execute.call(this, params);
        instr = this.program.fetch();
    }
};

module.exports = JVMEngine;