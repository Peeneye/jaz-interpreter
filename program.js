var SymbolTable = require('./symbol-table');
var Program = function (instrs, labels) {
    var labels = labels || {},
        instructions = instrs,
        pc = 0,
        size = instrs.length,
        context = {
            vars: {},
            pc: 0
        },
        callParams = {},
        ret = {};

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
            context.vars[k] = v;
        } else {
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
    
    this.param = function (k, v) {
        callParams[k] = v;
    };
    
    this.getParams = function () {
        return JSON.parse(JSON.stringify(callParams));
    };
    
    this.clearParams = function () {
        callParams = {};
    };
    
    this.retVar = function (k) {
        return ret[k];
    };
    
    this.setReturn = function (retCtx) {
        ret = retCtx;
    };
    
    this.clearReturn = function () {
        ret = {};
    };
    
    this.jump = function (lbl) {
        context.pc = labels[lbl];
    };
    
    this.getContext = function () {
        return context;
    };
    
    this.setContext = function (c) {
        context = c;
    };
};

module.exports = Program;