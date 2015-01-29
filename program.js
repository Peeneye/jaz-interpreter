var Program = function (instrs, labels) {
    var labels = labels || {},
        instructions = instrs,
        pc = 0,
        size = instrs.length,
        context = {
            vars: {},
            pc: 0
        };

    this.fetch = function () {
        if (context.pc < size) {
            var retInstr = instructions[context.pc];
            context.pc++;
            return retInstr;
        }
        return -1;
    };

    this.var = function (k, v) {
        if (typeof (v) !== 'undefined') {
            //console.log("Setting var " + k + " to val " + v);
            context.vars[k] = v;
        } else {
            if (isNaN(k)) {
            //console.log("Trying to get var " + k + " whose val is " + context.vars[k]);
        }
            return context.vars[k] !== null ? context.vars[k] : null;
        }
    };

    this.label = function (lbl, idx) {
        if (idx) {
            labels[lbl] = idx;
        } else {
            return labels[lbl];
        }
    };
    
    this.jump = function (lbl) {
        context.pc = labels[lbl];
    };
    
    this.getContext = function () {
        return context;
    }
    
    this.setContext = function (c) {
        context = c;
    };
};

module.exports = Program;