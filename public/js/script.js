// Google map, Tampere area

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 61.497752, lng: 23.760954 },
    zoom: 12,
  });
}

window.onload = function () {
  const items = []; 
  const items2 = []; 

  const Item = function (name, coords, descr) {
    this.addName = function (name) {
      this.name = name;
    };

    this.addCoords = function (coords) {
      this.coords = coords;
    };
    this.addDescr = function (descr) {
      this.description = descr;
    };
  };

  // json coordinate data is loaded

  $.get( "http://opendata.navici.com/tampere/opendata/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=opendata:YV_LUONNONMUISTOMERKKI&outputFormat=json", function( response ) {
  
    const datat = response.features;
    let trecoords;
    let tempcoords;
    let tempitem;

	console.log(datat);
  
      datat.forEach(function(el) {
	
		//console.log(el);
		let tempdescr;

      if (el.geometry.type == 'Point') {
        tempitem = new Item();
        tempitem.addName(el.properties.NIMI);
		
		tempdescr = el.properties.KOHTEENKUVAUS1;
		
		if (el.properties.KOHTEENKUVAUS2 != null) {
          tempdescr = tempdescr+" "+el.properties.KOHTEENKUVAUS2;
		}
		if ((el.properties.LISATIEDOT1 != null)){
		  tempdescr = tempdescr+" "+el.properties.LISATIEDOT1;
		}
		
		if ((el.properties.LISATIEDOT2 != null)){
		  tempdescr = tempdescr+" "+el.properties.LISATIEDOT2;
		}
		
		tempitem.addDescr(tempdescr);
		
		
        items.push(tempitem);

        tempcoords = el.geometry.coordinates.toString();

        // coordinate string with ';' separator
        if (trecoords) {
          trecoords = trecoords+";"+tempcoords;
        } else {
          trecoords = tempcoords;
        }
      }
    }); // forEach
  
  
    const nametable = JSON.stringify(items);
    console.log(nametable);

    $.getJSON( "http://epsg.io/trans?data="+trecoords+"&s_srs=3878&&t_srs=4326", function( response ) {
      let infowindow = null;

      response.forEach(function(el, index) {
        const tempitem = new Item();
        tempitem.addCoords("{\"lat\": "+parseFloat(el.y)+", \"lng\": "+parseFloat(el.x)+"}");

        items2.push(tempitem.coords);

        // new marker

		const marker = new google.maps.Marker({
		  position: {lat: parseFloat(el.y), lng: parseFloat(el.x)},
		  map: map,
		  title: items[index].name
		});

        // contents for infowindows, items is array with spot description info
				
		const contentString = '<div id="content">'
		  +'<div id="siteNotice">'
		  +'</div>'
		  +'<h1 id="firstHeading" class="firstHeading">'+items[index].name+'</h1>'
		  +'<div id="bodyContent">'
		  +'<p>'+items[index].description+'</p>'
		  +'</div>'
		  +'</div>';		

        infowindow = new google.maps.InfoWindow({
          content: contentString,
        });

        marker.addListener('mousedown', function() {
          infowindow.close();
          infowindow = new google.maps.InfoWindow({
            content: contentString,
          });

          infowindow.open(map, marker);
        });

        items2.push(marker);
      }); // forEach
    }); // getJSON
	
  /*}) // get coords
    .fail(function() {
      alert('Sorry, could not load the coordinate data. Please try again later. If the problem persists, contact the administrator.');*/
    });
}; // window.onload
