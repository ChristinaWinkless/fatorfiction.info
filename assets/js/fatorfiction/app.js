/* 
    Document   : app.js
    Author     : David
    Description:
        The base application.
*/

var fatorfiction = function() {

        /*
         * @private
         */


        /*
         * @public
         */
        var self = {

            // Is the browser supported ?
            browserSupported: null,

            // Defone tracking actions
            trackingActions: {

                ROLL_OVER: "Rollover",
                VIEW_CHANGE: "View Change",
                BROWSER_UNSUPPORTED: "Browser Unsupported",
                OUTBOUND: "Outbound"
            },

            // Footer social
            $footerSocial: null,

            // Anna, Christina & David links
            $annaChristinaDavid: null,


            /*
             * Initalise
             */
            init: function() {

                this.testBrowserSupport();

                if (this.browserSupported) this.setup();
            },

            setup: function() {

                this.$footerSocial = $('footer.social');
                this.$annaChristinaDavid = $('ul.anna-christina-david');

                this.addShareLinks();
                this.addEventListeners();
            },

            /*
             * Test the browser for the required HTML5 features
             */
            testBrowserSupport: function() {

                if (Modernizr.canvas && Modernizr.fontface && Modernizr.history) {

                    this.browserSupported = true;

                } else {

                    this.browserSupported = false;

                    // To prevent redirects on the unsupported page
                    if (typeof unsupported != 'undefined') {

                        this.trackEvent(pageUrl, this.trackingActions.BROWSER_UNSUPPORTED, browser);
                        window.location = '/error/unsupported';
                    }
                }
            },

            /**
             * Add share link urls
             */
            addShareLinks: function() {

                var url = encodeURIComponent(pageUrl);
                var text = encodeURIComponent("@fatorfiction");
                var twitterUrl = "http://twitter.com/share?url=" + url + "&text=" + text;
                var facebookUrl = "http://www.facebook.com/sharer.php?u=" + url;

                this.$footerSocial.find('ul li a.twitter').attr('href', twitterUrl);
                this.$footerSocial.find('ul li a.facebook').attr('href', facebookUrl);
            },

            /**
             * Add Event Listeners
             */
            addEventListeners: function() {

                var _this = this;

                this.$footerSocial.find('ul li a').click(function(event) {

                    var url = $(this).attr('href');

                    _this.trackOutboundEvent(pageUrl, _this.trackingActions.OUTBOUND, url);
                });

                this.$annaChristinaDavid.find('li a').click(function(event) {

                    var url = $(this).attr('href');

                    _this.trackOutboundEvent(pageUrl, _this.trackingActions.OUTBOUND, url);                
                });
            },

            /*
             * Track an event
             * @param string category
             * @param string action
             * @param string label
             */
            trackEvent: function(category, action, label) {

                //log(category + " " + action + " " + label);
                _gaq.push(['_trackEvent', category, action, label]);
            },

            /*
             * Track an outbound event
             * @param string category
             * @param string action
             * @param string link
             */
            trackOutboundEvent: function(category, action, link) {

                //log(category + " " + action + " " + link);
                _gaq.push(['_trackEvent', category, action, link]);
            }
        };

        return self;
    }();

$(function() {
    fatorfiction.init();
});
