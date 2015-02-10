var Labeler = {
    getLabels: function (instructions) {
        var labels = {},
            offset = 0;

        instructions.forEach(function (instr, idx) {
            if (instr.indexOf('label') !== -1) {
                var lbl = instr.trim().split(' ')[1];
                labels[lbl] = idx;
            }
        });

        for (var lbl in labels) {
            var idx = labels[lbl] + offset;
            instructions.splice(idx, 1);
            labels[lbl] = idx;
            offset--;
        }

        labels.main = 0;
        
        return labels;
    }
};

module.exports = Labeler;