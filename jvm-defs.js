var Program = require('./program');
module.exports = {

    ":=": function () {
        var val = this.pop(),
            ptr = this.pop();

        val = this.program.var(val) || val;

        if (this.state === 'sub-start') {
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
        if (val === null || typeof(val) === 'undefined') {
            if (this.program.retVar(ptr)) {
                val = this.program.retVar(ptr);
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
        this.state = 'halted';
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
        this.push(0 | (this.pop() / this.pop()));
    },

    div: function () {
        this.push(this.pop() % this.pop());
    },

    "&": function () {
        this.push(this.pop() & this.pop());
    },

    "!": function () {
        this.push(~this.pop());
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
        console.log(output || "\n");
    },

    begin: function () {
        this.state = 'sub-start';
    },

    call: function (lbl) {
        var start = this.program.label(lbl),
            params = this.program.getParams(),
            newContext = {
                pc: start,
                vars: params
            },
            currContext = this.program.getContext();

        this.pushFrame(currContext);
        this.program.setContext(newContext);
        this.state = 'sub-call';
        this.program.clearParams();
    },

    return : function () {
        var savedContext = this.popFrame();

        this.program.setReturn(this.program.getContext().vars);

        this.program.setContext(savedContext);
    },

    end: function () {
        this.program.clearReturn();
        this.state = 'normal';
    }
};