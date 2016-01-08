/* 
    Document   : orientation-helper.js
    Author     : David
    Description:
        A helper for ios orientation
        
*/

var OrientationHelper = function() {

        this.orientation = null;
        this.callbackFunctions = [];
        this.addListeners();
    }


    /*
     * Add a callback for state change
     * @param function func
     * @param object scope
     */
    OrientationHelper.prototype.addCallback = function(func, scope) {
        
        this.callbackFunctions.push({
            'callback': func,
            'scope': scope
        });
    }

    /*
     * Add event listeners
     */
    OrientationHelper.prototype.addListeners = function() {

        var _this = this;

        window.onorientationchange = function() {
            _this.onOrientationChange();
        }
    }

    /*
     * Handle the Orientation change
     */
    OrientationHelper.prototype.onOrientationChange = function() {

        var length = this.callbackFunctions.length;
        for (var i = 0; i < length; i++) {
            var callback = this.callbackFunctions[i];
            callback.callback.call(callback.scope);
        }
    }

    /*
     * Get the window orientation 
     */
    OrientationHelper.prototype.getOrientation = function() {

        return window.orientation;
    }
