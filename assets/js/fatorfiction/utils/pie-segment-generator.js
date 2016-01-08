/* 
    Document   : pie-segment-generator.js
    Author     : David
    Description:
        Create an array of points and export them to json
        For use with Paperjs
*/

var PieSegmentGenerator = function() {

        // Segments of points
        this.segments = new Object();

        // Array of circle's to display the points
        this.displayPoints = new Array();

        // Canvas mouse tool
        this.tool = new Tool();

        this.addListeners();
    }

    /*
     * Add event listeners
     */
    PieSegmentGenerator.prototype.addListeners = function() {
        var _this = this;

        // Canvas events
        this.tool.onMouseDown = function(event) {
            _this.capturePoints(event.point);
        }

        // Window events
        window.onkeypress = function(event) {
            if (event.keyCode == 99) {
                _this.capturePointsToJSON();
            }
        }
    }

    /*
     * Create a segment
     * @param name
     */
    PieSegmentGenerator.prototype.createSegment = function(name) {
        this.segments[name] = new Array();
        this.activeSegment = this.segments[name];
    }

    /*
     * Add a point to the points array
     * @param point
     */
    PieSegmentGenerator.prototype.capturePoints = function(point) {
        if(this.activeSegment == null) return;
        this.activeSegment.push(point);
        this.drawPoints();
    }

    /*
     * Serialize the capture points array to json
     */
    PieSegmentGenerator.prototype.capturePointsToJSON = function() {
        var json = JSON.stringify(this.segments, null, 2);
        log(json);
    }

    /*
     * Display the points of the active segment on the canvas
     */
    PieSegmentGenerator.prototype.drawPoints = function() {

        project.activeLayer.removeChildren(this.displayPoints);

        var length = this.activeSegment.length;
        for (var i = 0; i < length; i++) {

            var point = this.activeSegment[i];
            var circle = new Path.Circle(point, 2);
            circle.fillColor = '#ff0000';
            this.displayPoints.push(circle);
        }
    }

var segmentGenerator = new PieSegmentGenerator();
