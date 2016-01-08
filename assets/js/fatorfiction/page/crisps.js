/* 
    Document   : crisps.js
    Author     : David
    Description:
        The Crisps page.
*/

var crisps = function() {

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

            // The rollover image divs
            $rollovers: null,

            // The rollover images of the crisps
            $rolloverImages: null,
            $currentRolloverImage: null,

            // Canvas Element
            $canvas: null,

            // jQuery canvas selector
            $jCanvas: null,

            // Default Canvas view size
            viewSize: Object,
            viewSizeiPadPortrait: Object,

            // Mouse tool
            tool: null,

            // The crisps data
            crispsData: null,

            // The drinks shapes
            crispShapes: null,
            crispShapesScaled: null,

            // The amount to scale the segments by for iPad portrait
            scaleRatio: 0.724637681,

            // Hit options for the hotspots hover
            hitOptions: Object,

            // Keep track on the current crisp
            currentCrispName: String,


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

                this.crispsData = $.parseJSON(crispTypes);
                this.$canvas = document.getElementById('canvas-infographics');
                this.$foodInformation = $('div.food-information');
                this.$infographics = $('section.infographics');
                this.$rollovers = this.$infographics.find('div.rollover-image');
                this.$rolloverImages = this.$rollovers.find('img.rollover');
                this.$jCanvas = this.$infographics.find('canvas#canvas-infographics');

                if (platform === 'ipad') {
                    orientationHelper.addCallback(this.changeCanvasSize, this);
                }

                this.scaleRolloverVectors();

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
                    tolerance: 1
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
                            _this.onCrispOver(hitResult.item.name);
                        }
                    }

                } else {

                    this.tool.onMouseMove = function(event){
                        var hitResult = project.hitTest(event.point, _this.hitOptions);
                        project.activeLayer.selected = false;
                        if (hitResult && hitResult.item){
                            _this.onCrispOver(hitResult.item.name);
                        } else {
                            _this.onCrispOut();
                        }
                    }
                }
            },

            /*
             * Create hotspots for the rollovers
             */
            createHotspots: function() {

                var hotspots = $.parseJSON(crispHotspots);
                this.crispShapes = new Group();
                this.crispShapesScaled = new Group();

                for (var hotspot in hotspots) {

                    var crisp = hotspots[hotspot];

                    var sx = crisp.x;
                    sx *= this.scaleRatio;

                    var sy = crisp.y;
                    sy *= this.scaleRatio;

                    var sw = crisp.width;
                    sw *= this.scaleRatio;

                    var sh = crisp.height;
                    sh *= this.scaleRatio;

                    var rectangle = new Path.Rectangle(new Point(crisp.x, crisp.y), new Size(crisp.width, crisp.height));
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

                    this.crispShapes.addChild(rectangle);
                    this.crispShapesScaled.addChild(rectangleScaled);
                }

                this.crispShapesScaled.remove();
            },

            /*
             * Set the portrait positions for the rollovers
             */
            scaleRolloverVectors: function() {

                var _this = this;

                this.$rollovers.each(function() {

                    var $rollover = $(this);
                    var $img = $rollover.find('img');

                    var width = $img.width();
                    var height = $img.height();

                    var sw = width;
                    sw *= _this.scaleRatio;

                    var sh = height;
                    sh *= _this.scaleRatio;

                    var top = parseInt($rollover.css('top'));
                    var left = parseInt($rollover.css('left'));

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
             * Show the crisp data
             * @param string name
             */
            onCrispOver: function(name) {

                if(this.currentCrispName === name) return;

                this.onCrispOut();
                
                this.currentCrispName = name;
                this.$currentRolloverImage = $('div.rollover-image[data-slug=' + this.currentCrispName + ']');

                var data = null;
                for (var crisp in this.crispsData) {

                    if (this.crispsData[crisp].slug === this.currentCrispName) {
                        data = this.crispsData[crisp];
                        break;
                    }
                }

                var nameLine1 = data.information.nameLine1;
                var nameLine2 = data.information.nameLine2;
                var fat = data.information.fat;
                var calories = data.information.calories;
                var carbs = data.information.carbs;
                var protein = data.information.protein;
                var backgroundImage = data.image_large;

                this.$foodInformation.find('h2.name').find('span.line-1').html(nameLine1);
                this.$foodInformation.find('h2.name').find('span.line-2').html(nameLine2);
                this.$foodInformation.find('div.fat').find('span.amount').html(fat);
                this.$foodInformation.find('div.calories').find('span.amount').html(calories);
                this.$foodInformation.find('div.carbs').find('span.amount').html(carbs);
                this.$foodInformation.find('div.protein').find('span.amount').html(protein);
            
                this.$infographics.addClass(this.currentCrispName).css('background-image', 'url(' + backgroundImage + ')');
                this.$foodInformation.removeClass('is-hidden');
                this.$currentRolloverImage.removeClass('is-hidden');

                fatorfiction.trackEvent(pageUrl, fatorfiction.trackingActions.ROLL_OVER, data.name);
            },

            /*
             * Hide the food information and the crisp rollover image
             */
            onCrispOut: function(){

                this.$infographics.css('background-image', 'none').removeClass(this.currentCrispName);
                this.$foodInformation.addClass('is-hidden');

                this.currentCrispName = '';

                if(this.$currentRolloverImage)
                    this.$currentRolloverImage.addClass('is-hidden');
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

                    // Update the rollover positions
                    this.$rollovers.each(function(){

                        var $img = $(this)  .find('img');

                        var width = $img.data('portrait-width');
                        var height = $img.data('portrait-height');

                        var top = $(this).data('portait-top');
                        var left = $(this).data('portait-left');

                        $img.width(width);
                        $img.height(height);

                        $(this).css({
                            'top': top + 'px'
                            //'left': left + 'px'
                        });
                    });

                    // Set the canvas size
                    width = this.viewSizeiPadPortrait.width;
                    height = this.viewSizeiPadPortrait.height;

                    // Swap the crisp shapes
                    this.crispShapes.remove();
                    project.activeLayer.appendTop(this.crispShapesScaled);

                } else {

                    // Update the rollover positions
                    this.$rollovers.each(function(){
                        
                        var $img = $(this).find('img');

                        var width = $img.data('landscape-width');
                        var height = $img.data('landscape-height');

                        var top = $(this).data('landscape-top');
                        var left = $(this).data('landscape-left');

                        $img.width(width);
                        $img.height(height);

                        $(this).css({
                            'top': top + 'px'
                            //'left': left + 'px'
                        });
                    });

                    // Set the canvas size
                    width = this.viewSize.width;
                    height = this.viewSize.height;

                    // Swap the chocolate bar shapes
                    this.crispShapesScaled.remove();
                    project.activeLayer.appendTop(this.crispShapes);
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
    if(fatorfiction.browserSupported)
        crisps.init();
});
