var StateMachine = function (initialState) {
    var state = initialState || 0;
    
    this.getState = function () {
        return state;
    };
    
    this.setState = function (newState) {
        state = newState;
    };
};

module.exports = StateMachine;