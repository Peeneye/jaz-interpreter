var SymbolTable = function (t) {
    var table = t || {};
    
    this.sym = function (k, v) {
        if (typeof (v) !== 'undefined') {
            table[k] = v;
        } else {
            return table[k] !== null ? table[k] : null;
        }
    };
    
    this.getTable = function () {
        return JSON.parse(JSON.stringify(table));
    };
    
    this.setTable = function (t) {
        table = t || {};
    };
};

module.exports = SymbolTable;