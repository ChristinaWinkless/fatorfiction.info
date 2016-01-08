/* 
    Document   : chocolate.js
    Author     : David
    Description:
        The Alcohol page.
*/

var chocolate = function() {

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

            // Cross section images
            $crossSections: null,
            $currentCrossSection: null,

            // Canvas Element
            $canvas: null,

            // jQuery canvas selector
            $jCanvas: null,

            // Default Canvas view size
            viewSize: Object,
            viewSizeiPadPortrait: Object,

            // Mouse tool
            tool: null,

            // The drinks data
            chocolateData: null,

            // The drinks shapes
            chocolateBarShapes: null,
            chocolateBarShapesScaled: null,

            // The amount to scale the segments by for iPad portrait
            scaleRatio: 0.749318801,

            // Hit options for the hotspots hover
            hitOptions: Object,

            // Keep track of the current chocolate bar
            currentChocolateBarName: String,


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

                this.chocolateData = $.parseJSON(chocolateBars);
                this.$canvas = document.getElementById('canvas-infographics');
                this.$foodInformation = $('div.food-information');
                this.$infographics = $('section.infographics');
                this.$crossSections = this.$infographics.find('div.cross-section');
                this.$jCanvas = this.$infographics.find('canvas#canvas-infographics');

                if (platform === 'ipad') {
                    orientationHelper.addCallback(this.changeCanvasSize, this);
                    this.scaleCrossSectionVectors();
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
                    stroke: false,
                    fill: true,
                    tolerance: 2
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

                this.createHotspots();
                this.changeCanvasSize();
                this.draw();
                this.addListeners();
            },

            /*
             * Add Event Listeners
             */
            addListeners: function() {

                var _this = this;

                if(platform === 'ipad'){

                    this.tool.onMouseDown = function(event) {
                        var hitResult = project.hitTest(event.point, _this.hitOptions);
                        project.activeLayer.selected = false;
                        if (hitResult && hitResult.item) {
                            _this.onChocolateBarOver(hitResult.item.name);
                        }
                    }

                } else {

                    this.tool.onMouseMove = function(event) {
                        var hitResult = project.hitTest(event.point, _this.hitOptions);
                        project.activeLayer.selected = false;
                        if (hitResult && hitResult.item) {
                            _this.onChocolateBarOver(hitResult.item.name);
                        } else {
                            _this.onChocolateBarOut();
                        }
                    }
                }
            },

            /*
             * Create hotspots for the rollovers
             */
            createHotspots: function() {

                var hotspots = $.parseJSON(chocolateBarHotspots);

                this.chocolateBarShapes = new Group();
                this.chocolateBarShapesScaled = new Group();

                for (var hotspot in hotspots) {

                    var bar = hotspots[hotspot];

                    var sx = bar.x;
                    sx *= this.scaleRatio;

                    var sy = bar.y;
                    sy *= this.scaleRatio;

                    var sw = bar.width;
                    sw *= this.scaleRatio;

                    var sh = bar.height;
                    sh *= this.scaleRatio;

                    var rectangle = new Path.Rectangle(new Point(bar.x, bar.y), new Size(bar.width, bar.height));
                    var rectangleScaled = new Path.Rectangle(new Point(sx, sy), new Size(sw, sh));

                    rectangle.name = hotspot;
                    rectangleScaled.name = rectangle.name;

                    var style = {
                        strokeColor: '#000',
                        strokeWidth: 2,
                        fillColor: new RgbColor(Math.random() * 1, Math.random() * 1, Math.random() * 1)
                    };

                    rectangle.style = style;
                    rectangleScaled.style = style;

                    rectangle.opacity = 0;
                    rectangleScaled.opacity = 0;

                    this.chocolateBarShapes.addChild(rectangle);
                    this.chocolateBarShapesScaled.addChild(rectangleScaled);
                }

                this.chocolateBarShapesScaled.remove();
            },


            /*
             * Set the portrait positions for the cross sections
             */
            scaleCrossSectionVectors: function() {

                var _this = this;

                this.$crossSections.each(function() {

                    var $crossSection = $(this);
                    var $img = $crossSection.find('img');

                    var width = $img.width();
                    var height = $img.height();

                    var sw = width;
                    sw *= _this.scaleRatio;

                    var sh = height;
                    sh *= _this.scaleRatio;

                    var top = parseInt($crossSection.css('top'));
                    var left = parseInt($crossSection.css('left'));

                    var point = new Point(left, top);
                    point.length *= _this.scaleRatio;

                    $img.attr('data-width', width);
                    $img.attr('data-height', height);
                    $img.attr('data-portrait-width', sw);
                    $img.attr('data-portrait-height', sh);

                    $(this).attr('data-landscape-top', top);
                    $(this).attr('data-landscape-left', left);
                    $(this).attr('data-portait-top', Math.floor(point.y));
                    $(this).attr('data-portait-left', Math.floor(point.x));
                });
            },


            /*
             * Show the chocolate bar data
             * @param string name
             */
            onChocolateBarOver: function(name) {

                if (this.currentChocolateBarName === name) return;

                this.onChocolateBarOut();

                this.currentChocolateBarName = name;
                this.$currentCrossSection = $('div.cross-section[data-slug=' + this.currentChocolateBarName + ']');

                var data = null;
                for (var bar in this.chocolateData) {

                    if (this.chocolateData[bar].slug === this.currentChocolateBarName) {
                        data = this.chocolateData[bar];
                        break;
                    }
                }

                var nameLine1 = data.information.nameLine1;
                var nameLine2 = data.information.nameLine2;
                var fat = data.information.fat;
                var calories = data.information.calories;
                var carbs = data.information.carbs;
                var protein = data.information.protein;

                this.$foodInformation.find('h2.name').find('span.line-1').html(nameLine1);
                this.$foodInformation.find('h2.name').find('span.line-2').html(nameLine2);
                this.$foodInformation.find('div.fat').find('span.amount').html(fat);
                this.$foodInformation.find('div.calories').find('span.amount').html(calories);
                this.$foodInformation.find('div.carbs').find('span.amount').html(carbs);
                this.$foodInformation.find('div.protein').find('span.amount').html(protein);

                this.$foodInformation.removeClass('is-hidden');
                this.$currentCrossSection.removeClass('is-hidden');

                fatorfiction.trackEvent(pageUrl, fatorfiction.trackingActions.ROLL_OVER, data.name);
            },

            /*
             * Hide the chocolate bar data
             */
            onChocolateBarOut: function() {

                this.currentChocolateBarName = '';

                this.$foodInformation.addClass('is-hidden');

                if (this.$currentCrossSection) this.$currentCrossSection.addClass('is-hidden');
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

                    // Update the cross section positions
                    this.$crossSections.each(function(){

                        var $img = $(this)  .find('img');

                        var width = $img.data('portrait-width');
                        var height = $img.data('portrait-height');

                        var top = $(this).data('portait-top');
                        var left = $(this).data('portait-left');

                        $img.width(width);
                        $img.height(height);

                        $(this).css({
                            'top': top + 'px',
                            'left': left + 'px'
                        });
                    });

                    // Set the canvas size
                    width = this.viewSizeiPadPortrait.width;
                    height = this.viewSizeiPadPortrait.height;

                    // Swap the chocolate bar shapes
                    this.chocolateBarShapes.remove();
                    project.activeLayer.appendTop(this.chocolateBarShapesScaled);

                } else {

                    // Update the cross section positions
                    this.$crossSections.each(function(){
                        
                        var $img = $(this).find('img');

                        var width = $img.data('landscape-width');
                        var height = $img.data('landscape-height');

                        var top = $(this).data('landscape-top');
                        var left = $(this).data('landscape-left');

                        $img.width(width);
                        $img.height(height);

                        $(this).css({
                            'top': top + 'px',
                            'left': left + 'px'
                        });
                    });

                    // Set the canvas size
                    width = this.viewSize.width;
                    height = this.viewSize.height;

                    // Swap the chocolate bar shapes
                    this.chocolateBarShapesScaled.remove();
                    project.activeLayer.appendTop(this.chocolateBarShapes);
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
    if (fatorfiction.browserSupported) chocolate.init();
});
