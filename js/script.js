// JavaScript Document
var map;
var infowindow;
var request;
var service;
var markers = [];
var place;
var placeLoc;

function initialize() {
  placeLoc = new google.maps.LatLng(41.6667, -91.5333);

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: placeLoc,
    zoom: 15
  });

  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
  var searchBox = new google.maps.places.Autocomplete((input));
  searchBox.bindTo('bounds', map);

  google.maps.event.addListener(searchBox, 'place_changed', function() {
    place = searchBox.getPlace();
	placeLoc = place.geometry.location;
	
	clearMarkers();
	
	if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
	
  });
  
  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  //var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
  
  markers.push(marker);
}

function clearMarkers() {
  for(var i=0; i<markers.length; i++) {
	markers[i].setMap(null);
  }
  markers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function () {

$('li').on('click', function() {
  $(this).toggleClass('active');
});
	
$('#submit').on('click', function() { 
	
  clearMarkers();
 
  var places = [];
  $('li.active').each(function() { places.push($(this).text()) });
  
  if (places.length > 0) {
    request = {
      location: placeLoc,
      radius: 500,
      types: places
    };
	
    service.nearbySearch(request, callback);
  }
});
	

});