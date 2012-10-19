var map;
var stockholm = new google.maps.LatLng(59.333189,18.065643);

function initialize() {

	var memoryLayerStyles = [
	  {
	    elementType: "labels",
	    stylers: [
	      { saturation: -100 },
	      { lightness: 27 }
	    ]
	  },{
	    elementType: "geometry",
	    stylers: [
	      { saturation: -100 },
	      { gamma: 0.85 }
	    ]
	  }
	];

	var mapOptions = {
		zoom: 12,
		center: stockholm,
		disableDefaultUI: true,
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'memorylayer']
		}
	};

	map = new google.maps.Map(document.getElementById("memoryLayer"), mapOptions);
	var styledMapOptions = { name: "memory layer" };
	var memoryLayerMap = new google.maps.StyledMapType(memoryLayerStyles, styledMapOptions);

	map.mapTypes.set('memorylayer', memoryLayerMap);
	map.setMapTypeId('memorylayer');

	var currentPlace = null;
	var info = $('#memoryInfo');
	
	//get shit from json
	$.getJSON('js/memories.json', function(places) {
		$(places.memories).each(function() {
					
			var place = this;
			
			//put the markers
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(place.position[0], place.position[1]),
				map:      map,
				title:    place.title,
				icon:     'http://memorylayer.guimachiavelli.com/images/smallball.png'
			});
				
			//here's a nice video for you: http://www.youtube.com/watch?v=Xcs3OwrkcR4

			//create the onclick windows
			google.maps.event.addListener(marker, 'click', function() {
	
				//$('#memoryInfo').fadeOut(0);
				$('#memoryInfo').fadeIn('slow');
				$('#about').fadeOut('slow');
				$('h1', info).text(place.number);
				$('h2', info).text(place.title);
				$('img.regular', info).attr('src',place.image[0]);
				//$('img.zoom', info).attr('src',place.image[1]);
				$('p',  info).text(place.description);
				
			});
			var symbolCoordinates = [];
			
			google.maps.event.addListener(marker, 'mouseover', function() {
				
				for (var i = 0; i < place.symbol[0].points.length; i++) {
					symbolCoordinates[i] = new google.maps.LatLng(place.symbol[0].points[i].lat, place.symbol[0].points[i].long);
				}

				
				symbolPath = new google.maps.Polyline({
					path: symbolCoordinates,
					strokeColor: "#F00",
					strokeOpacity: 1.0,
					strokeWeight: 3
				});
				
				symbolPath.setMap(map);
				
			});
			
			google.maps.event.addListener(marker, 'mouseout', function() {
	    	    if(symbolPath){
	    	        symbolPath.setMap(null);
	    	    }
			});
			
			
		});
	});

var imageBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(59.325,17.93),
    new google.maps.LatLng(59.36,18.2));
    
	var memoryText = new google.maps.GroundOverlay("http://memorylayer.guimachiavelli.com/images/idrather.png",imageBounds);
	//memoryText.setMap(map);

};															 

//google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function() {

	initialize();
	
	$('.memoryClose').click(function(){$('#memoryInfo').fadeOut('slow');$('#about').fadeOut('slow')});
	
	$('a[href="#about"]').click(function(){
		$('#about').fadeIn('slow');
		return false;
	});
	
	
	
	
	if( $.cookie('visited') == '1' ) { 
		$('#intro h1').hide();
	} else {
		$('#intro h1').fadeOut(7000);
	}
	
	$.cookie('visited', '1', 1);

});