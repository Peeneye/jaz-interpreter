var SymbolTable = require('./symbol-table');
var ProgramContext = require('./program-context');
var Program = function (instrs, labels) {
    var labels = labels ? new SymbolTable(labels) : new SymbolTable(),
        instructions = instrs,
        size = instrs.length,
        context = new ProgramContext(),
        callParams = new SymbolTable(),
        ret = new SymbolTable();

    this.fetch = function () {
        var pc = context.getPC();
        if (pc < size) {
            return instructions[pc];
        }
        return -1;
    };

    this.var = function (k, v) {
        return context.var(k, v);
    };

    this.label = function (k, v) {
        return labels.sym(k, v);
    };
    
    this.param = function (k, v) {
        return callParams.sym(k, v);
    };
    
    this.getParams = function () {
        return callParams.getTable();
    }
    
    this.clearParams = function () {
        callParams = new SymbolTable();
    };
    
    this.retVar = function (k) {
        return ret.sym(k);
    };
    
    this.setReturn = function (returnContext) {
        ret = new SymbolTable(returnContext);
    };
        
    this.clearReturn = function () {
        ret = new SymbolTable();
    }
    
    this.jump = function (lbl) {
        context.setPC(labels.sym(lbl));
    };
    
    this.getContext = function () {
        return context;
    };
    
    this.setContext = function (ctx) {
        context = ctx;
    };
};

module.exports = Program;