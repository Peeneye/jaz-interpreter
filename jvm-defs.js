var Program = require('./program');
module.exports = {

    ":=": function () {
        var val = this.pop(),
            ptr = this.pop();

        val = this.program.var(val) || val;

        if (this.state === 'sub-start') {
            this.callParams[ptr] = val;
            console.log(this.callParams);
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
        if (val === null) {
            val = ptr;
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
            params = JSON.parse(JSON.stringify(this.callParams)),
            newContext = {
                pc: start,
                vars: params
            },
            currContext = this.program.getContext();
        
        console.log("PUSHING CONTEXT:");
        console.log(currContext);
        console.log("SETTING CONTEXT:");
        console.log(newContext);

        this.pushFrame(currContext);
        this.program.setContext(newContext);
        this.state = 'sub-call';
        this.callParams = {};
    },

    return : function () {
        var savedContext = this.popFrame(),
            currentContext = this.program.getContext();

        console.log("SAVED CONTEXT:");
        console.log(savedContext);
        console.log("CURRENT CONTEXT:");
        console.log(currentContext);

        for (var v in currentContext.vars) {
            if (!savedContext.vars[v]) {
                savedContext.vars[v] = currentContext.vars[v];
            }
        }

        console.log("SAVED CONTEXT AFTER MESHING:");
        console.log(savedContext);

        this.program.setContext(savedContext);
    },

    end: function () {
        this.state = 'normal';
    }
};