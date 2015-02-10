var SymbolTable = require('./symbol-table');
var ProgramContext = require('./program-context');
var Program = function (instrs, labels) {
    var labels = labels ? new SymbolTable(labels) : new SymbolTable(),
        instructions = instrs,
        size = instrs.length,
        context = {
            pc: 0,
            vars: new SymbolTable()
        },
        callParams = new SymbolTable(),
        ret = new SymbolTable();

    this.fetch = function () {
        if (context.pc < size) {
            var retInstr = instructions[context.pc];
            context.pc++;
            return retInstr;
        }
        return -1;
    };

    this.var = function (k, v) {
        return context.vars.sym(k, v);
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
    
    this.setReturn = this.clearReturn = function (returnContext) {
        ret.setTable(returnContext);
    }
    
    this.jump = function (lbl) {
        context.pc = labels.sym(lbl);
    };
    
    this.getContext = function () {
        return context;
    };
    
    this.setContext = function (c) {
        context = c;
    };
};

module.exports = Program;