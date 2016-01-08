/* 
    Document   : state-manager.js
    Author     : David
    Description:
        A state manager for history.js
*/

var StateManager = function() {
        this.config = {
            ie: $.browser.msie,
            pageTitle: window.document.title
        };
        this.states = [];
        this.currentState = null;
        this.defaultState = null;
        this.callbackFunctions = [];
        this.History = History;
        this.State = History.getState();
        this.addEventListeners();
    }


    /*
     * Add event listeners
     */
    StateManager.prototype.addEventListeners = function() {

        var _this = this;
        this.History.Adapter.bind(window, 'statechange', function() {
            _this.onStateChanged();
        });
    }

    /*
     * Add an array of states
     * @param array states
     */
    StateManager.prototype.addStates = function(states) {
        this.states = states;

        // Format titles
        for (var state in this.states) {
            var title = this.states[state].title;
            this.states[state].title = this.formatPageTitle(title);
        }

        this.defaultState = this.states[0];
        this.changeState(this.getLastURLSegment(window.location.href));
    }

    /*
     * Add a callback for state change
     * @param function func
     * @param object scope
     */
    StateManager.prototype.addStateChangeCallback = function(func, scope) {
        this.callbackFunctions.push({
            'callback': func,
            'scope': scope
        });
    }

    /*
     * Change the current state
     * @param string url
     */
    StateManager.prototype.changeState = function(url) {

        var newState = null;
        for (var state in this.states) {
            if (this.states[state].url === url) {
                newState = this.states[state];
            }
        }

        // Set state to default
        if (newState === null) {
            newState = this.defaultState;
        }

        if (this.config.ie) {
            History.pushState(null, null, newState.url);
        } else {
            History.pushState(newState.data, newState.title, newState.url);
            History.setTitle(newState);
        }

        this.currentState = newState;
    }

    /*
     * Cycle the states by a direction
     * @param int direction
     * @param bool includeDefault
     */
    StateManager.prototype.cycleStates = function(direction, includeDefault){

        var currentStateIndex = direction;
        for(var state in this.states){

            if(this.states[state].data.view === this.currentState.data.view){
                currentStateIndex += parseInt(state);
            }
        }

        if(currentStateIndex >= this.states.length){
            currentStateIndex = (includeDefault) ? currentStateIndex = 0 : currentStateIndex = 1;
        } else if(currentStateIndex === 0){
            currentStateIndex = (includeDefault) ? currentStateIndex = 0 : currentStateIndex = this.states.length-1;
        }

        var url = this.states[currentStateIndex].url;
        this.changeState(url);
    }

    /*
     * Handle the state change
     */
    StateManager.prototype.onStateChanged = function() {

        this.State = History.getState();
        this.logState();

        var length = this.callbackFunctions.length;
        for (var i = 0; i < length; i++) {
            var callback = this.callbackFunctions[i];
            callback.callback.call(callback.scope);
        }
    }

    /*
     * Format the new page title
     */
    StateManager.prototype.formatPageTitle = function(title) {
        return this.config.pageTitle + ' - ' + title;
    }

    /*
     * Get the last url segment
     */
    StateManager.prototype.getLastURLSegment = function(url) {
        var _url = url.split('/');
        return _url[_url.length - 1];
    }

    /*
     * Get the last url segment
     */
    StateManager.prototype.getState = function() {
        return this.State;
    }

    /*
     * Log the current state
     */
    StateManager.prototype.logState = function() {
        //History.log('statechange:', this.State.data, this.State.title, this.State.url);
    }
