$(function(){

    $.fn.interactiveWorldMap = function(options) {
        event.preventDefault();
        var marginCountryPopupForTop  = $.fn.interactiveWorldMap.defaults.marginCountryPopupForTop;
        var marginCountryPopupForLeft = $.fn.interactiveWorldMap.defaults.marginCountryPopupForLeft;
        var dataCountries = {};
        if(options) {
            dataCountries                           = options['countries'];
            //Location of the popup when its launched
            var margins                             = options['margins'];

            if(margins && typeof(margins['marginCountryPopupForTop']) != "undefined" ) {
                marginCountryPopupForTop            = margins['marginCountryPopupForTop'];
            }

            if(margins && typeof(margins['marginCountryPopupForLeft']) != 'undefined') {
                marginCountryPopupForLeft           = margins['marginCountryPopupForLeft'];
            }

            if(options['colors']) {
                $.fn.interactiveWorldMap.defaults.highlighted  = options['colors']['highlighted'];
                $.fn.interactiveWorldMap.defaults.hover        = options['colors']['hover'];
            }

        } else {

            dataCountries = $(this).data('countries');
            dataCountries = dataCountries['countries'];

            $data = $(this).data();

            if($data.margincountrypopupfortop) {
                marginCountryPopupForTop            = $data.margincountrypopupfortop;
            }

            if($data.margincountrypopupforleft) {
                marginCountryPopupForLeft          = $data.margincountrypopupforleft;
            }

            if($data.colorhover){
                $.fn.interactiveWorldMap.defaults.hover       = $data.colorhover
            }
            if($data.colorhighlighted){
                $.fn.interactiveWorldMap.defaults.highlighted = $data.colorhighlighted;
            }
        }

        var countriesFill = {};
        $.each(dataCountries, function(index, value) {
                countriesFill[index] = 'url(#dotsHighlighted)';
            }
        );


        $( this ).vectorMap( {
            map             : 'world_mill_en',
            backgroundColor : 'white',
            regionStyle: {

                initial: {
                    fill            :   'url(#dotsGeneral)'
                },

                hover: {
                    "fill-opacity":  1
                }
            },
            series: {
                regions: [{
                    values: countriesFill,
                    attribute: 'fill',
                    hover: {
                        "fill-opacity":  0.8,
                        cursor:         'pointer'
                    }
                }]
            },
            onRegionOver: function (e, code) {
                if(dataCountries[code]){
                    data = new Array;
                    data[code] = 'url(#dotsHover)';
                    var mapObject = $(this).parent().vectorMap('get', 'mapObject');
                    mapObject.series.regions[0].setValues(data);
                }
            },
            onRegionOut: function (e, code) {
                if(dataCountries[code]) {
                    data = new Array;
                    data[code] = 'url(#dotsHighlighted)';
                    var mapObject = $(this).parent().vectorMap('get', 'mapObject');
                    mapObject.series.regions[0].setValues(data);
                }
            },

            onRegionClick: function(e, code){
                if(!dataCountries[code]) {
                    return;
                }
                var $this = $(this);
                $element   = $('g', $this).find("[data-code='" + code  + "']");
                $offset    = $element.offset();

                $(".main-modal, #modal-background").toggleClass("active");
                // Calculate the distance between the country and the top for show with the correctly space the popup
                distanceXtop = $offset.top  - marginCountryPopupForTop;
                distanceLeft = $offset.left + marginCountryPopupForLeft;

                var first           = dataCountries[code];
                countryName         = first['name'];
                description         = first['description'];
                mainImage           = first['main_image'];

                $(".main-modal" ).css("top", distanceXtop + 'px').css("left", distanceLeft + 'px');
                $(".main-modal .description").text(description);
                $(".main-modal .title").text(countryName);
                $(".main-image").attr('src', mainImage);

            }

        });
        //Configurations for the map. Dotted Style and popup prepended
        colorHighlighted = $.fn.interactiveWorldMap.defaults.highlighted;
        colorHover       = $.fn.interactiveWorldMap.defaults.hover;
        pattern  = '<pattern id="dotsGeneral" width="5" height="5" patternUnits="userSpaceOnUse"><circle x="1" y="1" cx="3" cy="3" r="3" style="stroke:none; fill:#cccccc;"></circle></pattern>';
        pattern2 = '<pattern id="dotsHighlighted" width="5" height="5" patternUnits="userSpaceOnUse"><circle x="1" y="1" cx="3" cy="3" r="3" style="stroke:none; fill:' + colorHighlighted + '"></circle></pattern>';
        patternHover = '<pattern id="dotsHover" width="5" height="5" patternUnits="userSpaceOnUse"><circle x="1" y="1" cx="3" cy="3" r="3" style="stroke:none; fill:' + colorHover+ '"></circle></pattern>';
        $(this).parent().prepend('<div class="main-modal"><div class="container"><div class="title"></div><div class="container-image" ><img src="" class="main-image" alt=""></div><p><h2></h2><div class="description"></div></p></div></div>');
        $('defs').html(pattern+pattern2+patternHover);
    };


    $.fn.interactiveWorldMap.defaults = {
        hover : "#FF0000",
        highlighted: "#848484",
        marginCountryPopupForTop: 100,
        marginCountryPopupForLeft: 60
    }

});

