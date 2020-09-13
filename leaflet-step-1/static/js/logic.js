var url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
d3.json(url, function(data){
    createFeatures(data.features);
});
function selectColor(mag){
    switch (true){
        case (mag < 1):
            Color = "#a54500"
            break;
          case (mag < 2):
            Color = "#cc5500"
            break;
          case (mag < 3):
            Color = "#ff6f08"
            break;
          case (mag < 3.5):
            Color = "#ff9143"
            break;
          case (mag < 4):
            Color = "#ffb37e"
            break;
          case (mag < 5):
            Color = "#ffcca5"
            break;
          default:
            Color = "#ffcca5"
        }
        return (Color)
      }

function createFeatures (earthquakeData){
    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>Magnitude"+feature.properties.mag + "</h3><hr><p>" +new Date(feature.properties.time) +"</p>")
    }
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var geojsonMarkerOptions = {
              radius: feature.properties.mag * 5,
              fillColor: selectColor(feature.properties.mag),
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
          }
        });
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXJ0cGVya2l0bnkiLCJhIjoiY2tlYzJ6a2gzMDN4cTJ1czUwdjloZDIzYSJ9.WDgGSZK0DbPksCA47bnNNQ', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoicmFta3JhdXQiLCJhIjoiY2tlYzJzOTJyMDVvZjJycG42NXhlM2Q3aCJ9.Pe-LGb5g8ZJWnVQ8S6_D3w"
    });
  
    var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXJ0cGVya2l0bnkiLCJhIjoiY2tlYzJ6a2gzMDN4cTJ1czUwdjloZDIzYSJ9.WDgGSZK0DbPksCA47bnNNQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1IjoicmFta3JhdXQiLCJhIjoiY2tlYzJzOTJyMDVvZjJycG42NXhlM2Q3aCJ9.Pe-LGb5g8ZJWnVQ8S6_D3w"
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var Map = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(Map);
  }
  
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 3.5, 4, 5],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + selectColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(Map); 

  