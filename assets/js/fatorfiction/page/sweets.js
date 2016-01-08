/* 
    Document   : sweets.js
    Author     : David
    Description:
        The Sweets page.
*/

var sweets = function() {

        /*
         * @private
         */
        var spritesheetAnimator = new SpritesheetAnimator();
        var orientationHelper = new OrientationHelper();

        /*
         * @public
         */
        var self = {

            // Food information panel
            $foodInformation: null,

            // The infographics container
            $infographics: null,

            // The sweets
            $sweets: null,

            // Current text element of the sweet
            $currentSweet: null,
            $currentNameText: null,

            // Canvas Element
            $canvas: null,

            // jQuery canvas selector
            $jCanvas: null,

            // Default Canvas view size
            viewSize: Object,
            viewSizeiPadPortrait: Object,

            // Mouse tool
            tool: null,

            // The sweets data
            sweetData: null,

            // The sweets shapes
            sweetShapes: null,
            sweetShapesScaled: null,

            // The amount to scale the rectangles by for iPad portrait
            scaleRatio: 0.681818182,

            // Hit options for the hotspots hover
            hitOptions: Object,

            // Keep track of the current sweet
            currentSweetName: String,

            // Keep track of whether the current sweet is animating
            isAnimating: Boolean,

            // The interval speed on the spritesheet animations
            intervalSpeed: 300,

            // Reset the animation background position for iPad
            resetAnimationBackground: null,


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

                this.sweetData = $.parseJSON(sweetTypes);
                this.$canvas = document.getElementById('canvas-infographics');
                this.$foodInformation = $('div.food-information');
                this.$infographics = $('section.infographics');
                this.$sweets = this.$infographics.find('div.sweet');
                this.$jCanvas = this.$infographics.find('canvas#canvas-infographics');

                if (platform === 'ipad') {

                    this.resetAnimationBackground = true;

                    orientationHelper.addCallback(this.changeCanvasSize, this);
                    this.scaleHoverVectors();
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
                            _this.onSweetOver(hitResult.item.name);
                        }
                    }

                } else {

                    this.tool.onMouseMove = function(event){
                        var hitResult = project.hitTest(event.point, _this.hitOptions);
                        project.activeLayer.selected = false;
                        if (hitResult && hitResult.item){
                            _this.onSweetOver(hitResult.item.name);
                        } else {
                            _this.onSweetOut();
                        }
                    }
                }
            },

            /*
             * Create hotspots for the rollovers
             */
            createHotspots: function() {

                var hotspots = $.parseJSON(sweetHotspots);

                this.sweetShapes = new Group();
                this.sweetShapesScaled = new Group();

                for (var hotspot in hotspots) {

                    var sweet = hotspots[hotspot];

                    var sx = sweet.x;
                    sx *= this.scaleRatio;

                    var sy = sweet.y;
                    sy *= this.scaleRatio;

                    var sw = sweet.width;
                    sw *= this.scaleRatio;

                    var sh = sweet.height;
                    sh *= this.scaleRatio;

                    var rectangle = new Path.Rectangle(new Point(sweet.x, sweet.y), new Size(sweet.width, sweet.height));
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

                    this.sweetShapes.addChild(rectangle);
                    this.sweetShapesScaled.addChild(rectangleScaled);
                }

                this.sweetShapesScaled.remove();
            },

            /*
             * Set the portrait positions for the cross sections
             */
            scaleHoverVectors: function() {

                var _this = this;

                this.$sweets.each(function() {

                    var $sweet = $(this);

                    var width = parseInt($sweet.css('width'));
                    var height = parseInt($sweet.css('height'));

                    var sw = width;
                    sw *= _this.scaleRatio;

                    var sh = height;
                    sh *= _this.scaleRatio;

                    var top = parseInt($sweet.css('top'));
                    var left = parseInt($sweet.css('left'));

                    var point = new Point(left, top);
                    point.length *= _this.scaleRatio;

                    $sweet.attr('data-landscape-width', width);
                    $sweet.attr('data-landscape-height', height);
                    $sweet.attr('data-landscape-top', top);
                    $sweet.attr('data-landscape-left', left);

                    $sweet.attr('data-portrait-width', Math.floor(sw));
                    $sweet.attr('data-portrait-height', Math.floor(sh));
                    $sweet.attr('data-portait-top', Math.floor(point.y));
                    $sweet.attr('data-portait-left', Math.floor(point.x));
                });
            },

            /*
             * Show the sweet data
             * @param string name
             */
            onSweetOver: function(name) {

                if(this.currentSweetName === name) return;

                this.onSweetOut();
                
                this.currentSweetName = name;
                this.$currentSweet = $('div.sweet[data-slug=' + this.currentSweetName + ']');
                this.$currentNameText = $('div.sweet-name[data-slug=' + this.currentSweetName + ']');

                var data = null;
                for (var sweet in this.sweetData) {

                    if (this.sweetData[sweet].slug === this.currentSweetName) {
                        data = this.sweetData[sweet];
                        break;
                    }
                }

                var animated = data.animated;
                var nameLine1 = data.information.nameLine1;
                var nameLine2 = data.information.nameLine2;
                var sugar = data.information.sugar;
                var fat = data.information.fat;
                var calories = data.information.calories;
                var carbs = data.information.carbs;
                var protein = data.information.protein;

                this.$foodInformation.find('h2.name').find('span.line-1').html(nameLine1);
                this.$foodInformation.find('h2.name').find('span.line-2').html(nameLine2);
                this.$foodInformation.find('div.sugar').find('span.amount').html(sugar);
                this.$foodInformation.find('div.fat').find('span.amount').html(fat);
                this.$foodInformation.find('div.calories').find('span.amount').html(calories);
                this.$foodInformation.find('div.carbs').find('span.amount').html(carbs);
            
                this.$foodInformation.removeClass('is-hidden');
                this.$currentNameText.removeClass('is-hidden');

                this.startSweetAnimation();

                fatorfiction.trackEvent(pageUrl, fatorfiction.trackingActions.ROLL_OVER, data.name);
            },

            /*
             * Hide the sweet data
             */
            onSweetOut: function(){

                this.currentSweetName = '';

                if(spritesheetAnimator.isPlaying)
                    this.stopSweetAnimation(this.resetAnimationBackground);

                this.$foodInformation.addClass('is-hidden');

                if(this.$currentNameText)
                    this.$currentNameText.addClass('is-hidden');
            },

            /*
             * Start the current sweet animation
             */
            startSweetAnimation: function(){

                if(!this.$currentSweet) return;

                spritesheetAnimator.setTarget(this.$currentSweet);
                spritesheetAnimator.interval = this.intervalSpeed;
                spritesheetAnimator.start();
            }, 

            /*
             * Stop the current sweet animating
             * @param bool orientationChanged
             */
            stopSweetAnimation: function(orientationChanged){

                if(!this.$currentSweet) return;

                spritesheetAnimator.stop(orientationChanged);
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
                    this.$sweets.each(function(){

                        var $sweet = $(this);

                        var width = $sweet.data('portrait-width');
                        var height = $sweet.data('portrait-height');

                        var top = $sweet.data('portait-top');
                        var left = $sweet.data('portait-left');

                        $sweet.css({
                            'width': width + 'px',
                            'height': height + 'px',
                            'top': top + 'px',
                            'left': left + 'px'
                        });
                    });

                    // Set the canvas size
                    width = this.viewSizeiPadPortrait.width;
                    height = this.viewSizeiPadPortrait.height;

                    // Swap the sweet shapes
                    this.sweetShapes.remove();
                    project.activeLayer.appendTop(this.sweetShapesScaled);

                } else {

                    // Update the cross section positions
                    this.$sweets.each(function(){
                        
                        var $sweet = $(this);

                        var width = $sweet.data('landscape-width');
                        var height = $sweet.data('landscape-height');

                        var top = $sweet.data('landscape-top');
                        var left = $sweet.data('landscape-left');

                        $sweet.css({
                            'width': width + 'px',
                            'height': height + 'px',
                            'top': top + 'px',
                            'left': left + 'px'
                        }); 
                    });

                    // Set the canvas size
                    width = this.viewSize.width;
                    height = this.viewSize.height;

                    // Swap the chocolate bar shapes
                    this.sweetShapesScaled.remove();
                    project.activeLayer.appendTop(this.sweetShapes);
                }

                this.$jCanvas.width(width + 'px');
                this.$jCanvas.height(height + 'px');

                view.viewSize = new Size(width, height);

                this.stopSweetAnimation(this.resetAnimationBackground);
                this.startSweetAnimation();
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
        sweets.init();
});
