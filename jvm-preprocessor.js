var Tasks = {
    Labels: function (instructions) {
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
var JVMPreprocessor = {
    runTasks: function (tasks) {
        var taskResults = {};
        return {
            on: function (instructions) {
                tasks.forEach(function (task) {
                    if (Tasks[task]) {
                        var result = Tasks[task](instructions);
                        if (result) {
                            taskResults[task] = result;
                        }
                    } else {
                        throw "Invalid task " + task;
                    }
                });
                
                return taskResults;
            }
        };

    }
};

module.exports = JVMPreprocessor;