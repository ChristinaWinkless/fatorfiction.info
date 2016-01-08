/* 
    Document   : spritesheet-animator.js
    Author     : David
    Description:
        A spritesheet helper for the animation on sweets.js
*/

var SpritesheetAnimator = function() {

        // The element to perform the animation on
        this.$element = null;

        // The elements height
        this.elementHeight = null;

        // The jQuery timer
        this.timer = null;

        // The time interval in milliseconds
        this.interval = null

        // The amount of steps to increment the background position
        this.steps = null;

        // Keep track of the current step
        this.currentStep = null;

        // Keep track of the animation state
        this.isPlaying = false;
    }

    /*
     * Set the target for the animation
     */
    SpritesheetAnimator.prototype.setTarget = function($element, interval) {
        
        this.$element = $element;
        this.interval = interval;
        this.elementHeight = this.$element.height();
        this.steps = this.$element.data('steps');
        this.currentStep = parseInt(this.$element.data('current-step'));
    }

    /*
     * Set the target's data attributes so it knows the current step next time
     * @param bool resetAnimationBackground
     */
    SpritesheetAnimator.prototype.resetTarget = function(resetAnimationBackground) {

        var step = String(this.currentStep);

        if(resetAnimationBackground){
            step = 0;
            this.$element.css('background-position', '0 0');
        }
        
        this.$element.data('current-step', step);
    }

    /*
     * Start the animation
     */
    SpritesheetAnimator.prototype.start = function() {

        var _this = this;
        this.timer = window.setInterval(function(){
            _this.animate();
        }, this.interval);

        this.isPlaying = true;
    }

    /*
     * Stop the animation
     * @param bool resetAnimationBackground
     */
    SpritesheetAnimator.prototype.stop = function(resetAnimationBackground) {

        this.resetTarget(resetAnimationBackground);
        window.clearInterval(this.timer);
        this.isPlaying = false;
    }

    /*
     * Animate
     */
    SpritesheetAnimator.prototype.animate = function() {
        
        this.currentStep ++;
        if(this.currentStep >= this.steps) this.currentStep = 0;

        var y = ' -' + this.elementHeight * this.currentStep + 'px';
        this.$element.css('background-position', '0 ' + y)
    }
