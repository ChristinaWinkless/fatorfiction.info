/* 
    Document   : alcohol.js
    Author     : David
    Description:
        The Alcohol page.
*/

var alcohol = function() {

        /*
         * @private
         */
        var stateManager = new StateManager();
        var orientationHelper = new OrientationHelper();

        /*
         * @public
         */
        var self = {

            // Food information panel
            $foodInformation: null,

            // The all drinks view
            $viewAll: null,

            // The single drinks view
            $viewSingle: null,

            // The back to all button
            $backButton: null,

            // The carousel arrows
            $carouselArrows: null,

            // Current text element of the drink
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

            // The drinks data
            drinksData: null,

            // The drinks shapes
            drinkShapes: null,
            drinkShapesScaled: null,

            // The amount to scale the segments by for iPad portrait
            scaleRatio: 0.769230769,

            // Hit options for the hotspots hover
            hitOptions: Object,

            // Current view state
            currentState: Object,

            // The default view state
            defaultState: Object,

            // Keep track of the current drink for rollover
            currentDrinkName: String,


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

                stateManager.addStates($.parseJSON(states).states);
                stateManager.addStateChangeCallback(this.updateView, this);
                this.defaultState = stateManager.defaultState;

                this.drinksData = $.parseJSON(drinks);
                this.$canvas = document.getElementById('canvas-infographics');
                this.$foodInformation = $('div.food-information');
                this.$viewAll = $('section.infographics.alcohol.view-all');
                this.$viewSingle = $('section.infographics.alcohol.view-single');
                this.$backButton = this.$foodInformation.find('a.back');
                this.$carouselArrows = $('section.infographics.alcohol.view-single').find('a.arrow');
                this.$jCanvas = this.$viewAll.find('canvas#canvas-infographics');

                if (platform === 'ipad') {
                    orientationHelper.addCallback(this.changeCanvasSize, this);
                }

                this.setupCanvas();
                this.updateView();
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

                // jQuery ain't giving me the dimensions, hardcoded for now...
                var width = 780;
                var height = 303;
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

                this.tool.onMouseMove = function(event){
                    var hitResult = project.hitTest(event.point, _this.hitOptions);
                    project.activeLayer.selected = false;
                    if (hitResult && hitResult.item){
                        //hitResult.item.selected = true;
                        _this.onDrinkOver(hitResult.item.name);
                        _this.$viewAll.css('cursor', 'pointer');
                    } else {
                        _this.onDrinkOut();
                        _this.$viewAll.css('cursor', 'default');
                    }
                }

                this.tool.onMouseDown = function(event) {
                    var hitResult = project.hitTest(event.point, _this.hitOptions);
                    project.activeLayer.selected = false;
                    if (hitResult && hitResult.item) {
                        _this.changeView(hitResult.item.name);
                    }
                }

                this.$backButton.click(function(event) {

                    event.preventDefault();

                    var view = $(this).data('view');
                    _this.changeView(view);
                });

                this.$carouselArrows.click(function(event) {

                    event.preventDefault();

                    var direction = $(this).data('direction');
                    _this.cycleCarousel(direction);
                });

                if(platform === 'ipad'){

                    this.$viewSingle.swipe({
                        
                        swipeLeft: function() { 
                            _this.cycleCarousel('left');
                        },
                        swipeRight: function() { 
                            _this.cycleCarousel('right');
                        },
                    })
                }
            },

            /*
             * Create hotspots for the rollovers
             */
            createHotspots: function() {

                var hotspots = $.parseJSON(drinkHotspots);

                this.drinkShapes = new Group();
                this.drinkShapesScaled = new Group();

                for (var hotspot in hotspots) {

                    var drink = hotspots[hotspot];

                    var sx = drink.x;
                    sx *= this.scaleRatio;

                    var sy = drink.y;
                    sy *= this.scaleRatio;

                    var sr = drink.radius;
                    sr *= this.scaleRatio;

                    var circle = new Path.Circle(new Point(drink.x, drink.y), drink.radius);
                    var circleScaled = new Path.Circle(new Point(sx, sy), sr);

                    circle.name = hotspot;
                    circleScaled.name = circle.name;

                    var style = {
                        strokeColor: '#000',
                        strokeWidth: 2,
                        fillColor: new RgbColor(Math.random() * 1, Math.random() * 1, Math.random() * 1)
                    };

                    circle.style = style;
                    circleScaled.style = style;

                    circle.opacity = 0;
                    circleScaled.opacity = 0;

                    this.drinkShapes.addChild(circle);
                    this.drinkShapesScaled.addChild(circleScaled);
                }

                this.drinkShapesScaled.remove();
            },


            /*
             * Show the drink name
             * @param string name
             */
            onDrinkOver: function(name) {

                this.onDrinkOut();

                this.currentDrinkName = name;
                this.$currentDrinkText = $('div.drink-name[data-slug=' + this.currentDrinkName + ']');
                this.$currentDrinkText.removeClass('is-hidden');
            },

            /*
             * Hide the drink name
             * @param string name
             */
            onDrinkOut: function() {

                this.currentSweetName = '';

                if(this.$currentDrinkText)
                    this.$currentDrinkText.addClass('is-hidden');
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
                    this.drinkShapes.remove();
                    project.activeLayer.appendTop(this.drinkShapesScaled);

                } else {

                    // Set the canvas size
                    width = this.viewSize.width;
                    height = this.viewSize.height;

                    // Swap the segment shapes
                    this.drinkShapesScaled.remove();
                    project.activeLayer.appendTop(this.drinkShapes);
                }

                this.$jCanvas.width(width + 'px');
                this.$jCanvas.height(height + 'px');

                view.viewSize = new Size(width, height);
            },


            /*
             * Change the view
             * @param string view
             */
            changeView: function(view) {

                var newState = null;
                var title = "";
                for (var state in stateManager.states) {

                    var stateView = stateManager.states[state].data.view;
                    title = stateManager.states[state].data.title;

                    if (view === stateView) {
                        newState = stateManager.states[state];
                        break;
                    }
                }

                stateManager.changeState(newState.url);
            },

            /*
             * Update the view
             */
            updateView: function() {

                this.currentState = stateManager.getState();

                if (this.currentState.data.view === this.defaultState.data.view) {

                    this.$foodInformation.addClass('is-hidden');
                    this.$viewSingle.addClass('is-hidden');
                    this.$viewAll.removeClass('is-hidden');

                } else {

                    this.$viewAll.addClass('is-hidden');
                    this.$foodInformation.removeClass('is-hidden');
                    this.$viewSingle.removeClass('is-hidden');

                    var view = this.currentState.data.view;

                    var data = null;
                    for (var drink in this.drinksData) {

                        if (this.drinksData[drink].slug === view) {
                            data = this.drinksData[drink];
                            break;
                        }
                    }

                    var nameLine1 = data.information.nameLine1;
                    var nameLine2 = data.information.nameLine2;
                    var units = data.information.units;
                    var fat = data.information.fat;
                    var calories = data.information.calories;
                    var carbs = data.information.carbs;
                    var protein = data.information.protein;
                    var sugar = data.information.sugar;
                    var drinkImage = data.image;

                    this.$foodInformation.find('h2.name').find('span.line-1').html(nameLine1);
                    this.$foodInformation.find('h2.name').find('span.line-2').html(nameLine2);
                    this.$foodInformation.find('div.units').find('span.amount').html(units);
                    this.$foodInformation.find('div.fat').find('span.amount').html(fat);
                    this.$foodInformation.find('div.calories').find('span.amount').html(calories);
                    this.$foodInformation.find('div.carbs').find('span.amount').html(carbs);
                    this.$foodInformation.find('div.protein').find('span.amount').html(protein);
                    this.$foodInformation.find('div.sugar').find('span.amount').html(sugar);

                    this.$viewSingle.css('background-image', 'url(' + drinkImage + ')');
                }

                fatorfiction.trackEvent(pageUrl, fatorfiction.trackingActions.VIEW_CHANGE, this.currentState.data.title);
            },

            /*
             * Cycle the drinks carousel
             * @param string direction
             */
            cycleCarousel: function(direction) {

                var _direction = (direction === 'left') ? direction = -1 : direction = 1;

                stateManager.cycleStates(_direction, false);
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
        alcohol.init();
});
