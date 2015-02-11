var SymbolTable = require('./symbol-table');
var ProgramContext = function (programCounter, vars) {
    var pc = programCounter || 0,
        vars = vars ? new SymbolTable(vars) : new SymbolTable();
    
    this.var = function (k, v) {
        return vars.sym(k, v);
    };
    
    this.getVars = function () {
        return vars.getTable();
    };
    
    this.getPC = function () {
        var retPC = pc;
        pc++;
        return retPC;
    };
    
    this.setPC = function (newPC) {
        pc = newPC;
    };
};

module.exports = ProgramContext;