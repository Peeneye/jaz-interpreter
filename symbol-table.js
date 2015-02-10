var SymbolTable = function () {
    var table = {};
    
    this.sym = function (k, v) {
        if (typeof (v) !== 'undefined') {
            table[k] = v;
        } else {
            return table[k] !== null ? table[k] : null;
        }
    };
};

module.exports = SymbolTable;