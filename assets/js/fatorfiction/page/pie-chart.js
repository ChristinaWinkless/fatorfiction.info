/* 
    Document   : pie-chart.js
    Author     : David
    Description:
        A Pie Chart page.
*/

var pieChart = function() {

        /*
         * @private
         */
        var orientationHelper = new OrientationHelper();

        /*
         * @public
         */
        var self = {

            // Food information panel
            $foodInformation: null,

            // The infographics container
            $infographics: null,

            // Percentages
            $percentages: null,
            $currentPercent: null,

            // Canvas Element
            $canvas: null,

            // jQuery canvas selector
            $jCanvas: null,

            // Default Canvas view size
            viewSize: Object,
            viewSizeiPadPortrait: Object,

            // Mouse tool
            tool: null,

            // The segments data
            segmentsData: null,

            // The shapes of the pie segments
            segmentsShapes: null,
            segmentsShapesScaled: null,

            // The amount to scale the segments by for iPad portrait
            scaleRatio: 0.8,

            // The radius of the pie chart
            pieChartRadius: 0,

            // Hit options for the segments hover
            hitOptions: Object,

            // Keep track on the current pie segment
            currentSegmentName: String,


            /*
             * Initalise
             */
            init: function() {

                this.setup();
            },

            /*
             * Setup
             */
            setup: function() {

                this.pieChartRadius = radius;
                this.segmentsData = $.parseJSON(segments);
                this.$canvas = document.getElementById('canvas-infographics');
                this.$foodInformation = $('div.food-information');
                this.$infographics = $('section.infographics');
                this.$jCanvas = this.$infographics.find('canvas#canvas-infographics');
                this.$percentages = $('div.percent');

                if (platform === 'ipad') {
                    orientationHelper.addCallback(this.changeCanvasSize, this);
                }
                
                this.setupCanvas();
            },

            /*
             * Setup the canvas
             */
            setupCanvas: function() {

                paper.setup(this.$canvas);
                this.tool = new Tool();

                this.hitOptions = {
                    segments: true,
                    stroke: true,
                    fill: true,
                    tolerance: 5
                };

                var width = this.$jCanvas.width();
                var height = this.$jCanvas.height();
                var iPadPortraitWidth = this.$jCanvas.data('ipad-portrait-width');
                var iPadPortraitHeight = this.$jCanvas.data('ipad-portrait-height');

                this.viewSize = {
                    'width': width,
                    'height': height
                };
                this.viewSizeiPadPortrait = {
                    'width': iPadPortraitWidth,
                    'height': iPadPortraitHeight
                };

                this.createSegments();
                this.changeCanvasSize();
                this.draw();
                this.addListeners();
            },


            /*
             * Add Event Listeners
             */
            addListeners: function() {

                var _this = this;

                if (platform === 'ipad') {

                    this.tool.onMouseDown = function(event) {
                        var hitResult = project.hitTest(event.point, _this.hitOptions);
                        project.activeLayer.selected = false;
                        if (hitResult && hitResult.item) {
                            _this.onSegmentOver(hitResult.item.name);
                        }

                        var distance = Math.floor(Math.abs(event.point.getDistance(view.center)));

                        if (distance >= _this.pieChartRadius) {
                            _this.onSegmentOut();
                        }
                    }

                } else {

                    this.tool.onMouseMove = function(event) {
                        var hitResult = project.hitTest(event.point, _this.hitOptions);
                        project.activeLayer.selected = false;
                        if (hitResult && hitResult.item) {
                            //hitResult.item.selected = true;
                            _this.onSegmentOver(hitResult.item.name);
                        }

                        var distance = Math.floor(Math.abs(event.point.getDistance(view.center)));

                        if (distance >= _this.pieChartRadius) {
                            _this.onSegmentOut();
                        }
                    }
                }
            },

            /*
             * Create segments for the rollovers
             */
            createSegments: function() {

                // Create segments
                var segments = $.parseJSON(segmentsCoords);

                this.segmentsShapes = new Group();
                this.segmentsShapesScaled = new Group();

                for (var segment in segments) {

                    // Create paths
                    var path = new Path();
                    var pathScaled = new Path();

                    path.name = segment;
                    pathScaled.name = path.name;

                    var style = {
                        strokeColor: '#000',
                        strokeWidth: 2,
                        fillColor: new RgbColor(Math.random() * 1, Math.random() * 1, Math.random() * 1)
                    }

                    path.style = style;
                    pathScaled.style = style;

                    path.opacity = 0;
                    pathScaled.opacity = 0;

                    var length = segments[segment].length;
                    for (var i = 0; i < length; i++) {
                        var p = segments[segment][i];

                        var point = new Point(p.x, p.y);

                        var pointScaled = point.clone();
                        pointScaled.length *= this.scaleRatio;

                        path.add(point);
                        pathScaled.add(pointScaled);
                    }
                    path.closed = true;
                    pathScaled.closed = true;

                    this.segmentsShapes.addChild(path);
                    this.segmentsShapesScaled.addChild(pathScaled);

                }

                this.segmentsShapesScaled.remove();
            },


            /*
             * Show the segment data
             * @param string name
             */
            onSegmentOver: function(name) {

                if (this.currentSegmentName === name) return;

                this.onSegmentOut();

                this.currentSegmentName = name;
                this.$currentPercent = $('div.percent[data-slug=' + this.currentSegmentName + ']');

                var data = null;
                for (var segment in this.segmentsData) {

                    if (this.segmentsData[segment].slug === this.currentSegmentName) {
                        data = this.segmentsData[segment];
                        break;
                    }
                }

                var nameLine1 = data.information.nameLine1;
                var nameLine2 = data.information.nameLine2;
                var slice = data.information.slice;
                var fat = data.information.fat;
                var calories = data.information.calories;
                var carbs = data.information.carbs;
                var protein = data.information.protein;

                this.$foodInformation.find('h2.name').find('span.line-1').html(nameLine1);
                this.$foodInformation.find('h2.name').find('span.line-2').html(nameLine2);
                this.$foodInformation.find('img.slice').attr('src', slice);
                this.$foodInformation.find('div.fat').find('span.amount').html(fat);
                this.$foodInformation.find('div.calories').find('span.amount').html(calories);
                this.$foodInformation.find('div.carbs').find('span.amount').html(carbs);
                this.$foodInformation.find('div.protein').find('span.amount').html(protein);

                this.$foodInformation.removeClass('is-hidden');
                this.$currentPercent.removeClass('is-hidden');

                fatorfiction.trackEvent(pageUrl, fatorfiction.trackingActions.ROLL_OVER, data.name);
            },

            /*
             * Hide the segment data
             */
            onSegmentOut: function() {

                this.currentSegmentName = '';

                this.$foodInformation.addClass('is-hidden');

                if (this.$currentPercent) this.$currentPercent.addClass('is-hidden');
            },

            /**
             * Change the canvas view size on orientation
             * @param string orientation
             */
            changeCanvasSize: function() {

                var orientation = orientationHelper.getOrientation();

                var width;
                var height;

                if (orientation === 0 || orientation === 180) {

                    // Set the canvas size
                    width = this.viewSizeiPadPortrait.width;
                    height = this.viewSizeiPadPortrait.height;

                    // Swap the segment shapes
                    this.segmentsShapes.remove();
                    project.activeLayer.appendTop(this.segmentsShapesScaled);

                } else {

                    // Set the canvas size
                    width = this.viewSize.width;
                    height = this.viewSize.height;

                    // Swap the segment shapes
                    this.segmentsShapesScaled.remove();
                    project.activeLayer.appendTop(this.segmentsShapes);
                }

                this.$jCanvas.width(width + 'px');
                this.$jCanvas.height(height + 'px');

                view.viewSize = new Size(width, height);
            },

            /*
             * Draw the canvas
             */
            draw: function() {
                view.draw();
            }
        }

        return self;
    }();


paper.install(window);

$(function() {
    if (fatorfiction.browserSupported) pieChart.init();
});
