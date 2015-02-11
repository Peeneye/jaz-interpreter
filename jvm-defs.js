var ProgramContext = require('./program-context');
var JVMStates = require('./jvm-states');
var JVMDefs = {
    ":=": function () {
        var val = this.pop(),
            ptr = this.pop();

        val = this.program.var(val) || val;

        if (this.getState() === JVMStates.SUB_START) {
            this.program.param(ptr, val);
        } else {
            this.program.var(ptr, val);
        }
    },

    push: function (val) {
        this.push(val);
    },

    lvalue: function (ptr) {
        this.push(ptr);
    },

    rvalue: function (ptr) {
        var val = this.program.var(ptr);
        if (typeof(val) === 'undefined') {
            if (this.program.retVar(ptr)) {
                val = this.program.retVar(ptr);
            } else {
                val = 0;
                this.program.var(ptr, 0);
            }
        }
        this.push(val);
    },

    pop: function () {
        this.pop();
    },

    copy: function () {
        var top = this.pop();
        this.push(top);
        this.push(top);
    },

    goto: function (lbl) {
        this.program.jump(lbl);
    },

    gofalse: function (lbl) {
        if (this.pop() === 0) {
            this.program.jump(lbl);
        }
    },

    gotrue: function (lbl) {
        if (this.pop() !== 0) {
            this.program.jump(lbl);
        }
    },

    halt: function () {
        this.setState(JVMStates.HALTED);
    },

    "+": function () {
        this.push(this.pop() + this.pop());
    },

    "-": function () {
        var o2 = this.pop(),
            o1 = this.pop();
        this.push(o1 - o2);
    },

    "*": function () {
        this.push(this.pop() * this.pop());
    },

    "/": function () {
        var o2 = this.pop(),
            o1 = this.pop();
        
        this.push(0|(o1 / o2));
    },

    div: function () {
        var o2 = this.pop(),
            o1 = this.pop();
        
        this.push(o1 % o2);
    },

    "&": function () {
        this.push(this.pop() & this.pop());
    },

    "!": function () {
        this.push(!this.pop() ? 1 : 0);
    },

    "|": function () {
        this.push(this.pop() | this.pop());
    },

    "<>": function () {
        if (this.pop() !== this.pop()) {
            this.push(1);
        } else {
            this.push(0);
        }
    },

    "<=": function () {
        if (this.pop() > this.pop()) {
            this.push(1);
        } else {
            this.push(0);
        }
    },

    ">=": function () {
        if (this.pop() < this.pop()) {
            this.push(1);
        } else {
            this.push(0);
        }
    },

    "<": function () {
        if (this.pop() >= this.pop()) {
            this.push(1);
        } else {
            this.push(0);
        }
    },

    ">": function () {
        if (this.pop() <= this.pop()) {
            this.push(1);
        } else {
            this.push(0);
        }
    },

    "=": function () {
        if (this.pop() === this.pop()) {
            this.push(1);
        } else {
            this.push(0);
        }
    },

    print: function () {
        var top = this.pop();
        console.log(top);
        this.push(top);
    },

    show: function (output) {
        console.log(output === null ? "\n" : output);
    },

    begin: function () {
        this.setState(JVMStates.SUB_START);
    },

    call: function (lbl) {
        var start = this.program.label(lbl),
            params = this.program.getParams(),
            newContext = new ProgramContext(start, params),
            currContext = this.program.getContext();

        this.pushFrame(currContext);
        this.program.setContext(newContext);
        this.setState(JVMStates.SUB_CALL);
        this.program.clearParams();
    },

    return : function () {
        var savedContext = this.popFrame();
        this.program.setReturn(this.program.getContext().getVars());
        this.program.setContext(savedContext);
    },

    end: function () {
        this.program.clearReturn();
        this.setState(JVMStates.NORMAL);
    }
};

var JVMDefsFactory = {
    loadDefinitions: function (engineContext) {
        var retDefs = {};
        for (var def in JVMDefs) {
            retDefs[def] = JVMDefs[def].bind(engineContext);
        }
        
        return retDefs;
    }
};

module.exports = JVMDefsFactory;