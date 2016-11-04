function showRoute() {
  //Recuperation des valeurs sous forme de flotants
  var inputDepartLat = parseFloat(document.getElementById("PtDepLat").value);
  var inputDepartLong = parseFloat(document.getElementById("PtDepLong").value);
  var inputArriveeLat = parseFloat(document.getElementById("PtArrLat").value);
  var inputArriveeLong = parseFloat(document.getElementById("PtArrLong").value);
  var distance = parseFloat(document.getElementById("distanceEtapes").value);

  //Creation de l'itineraire
  var i = new Itineraire([inputDepartLat, inputDepartLong], [inputArriveeLat, inputArriveeLong], distance);

  //Calcul de la route
  route = i.getItineraire();

  //affiche sur la page la distance orthodromique
  var info = document.getElementById("info");
  info.innerHTML = "<p> Distance orthodromique : " + Math.round(i.getDistanceEnKm()) + " km</p>"
  var plan = document.getElementById("plan");
  plan.innerHTML = "";
  for (var i = 0; i < route.length; i++) {
    plan.innerHTML += "<li><b>Etape " + i + "</b> : lat: " + route[i][0][0].toFixed(4) + " lng: " + route[i][0][1].toFixed(4) + " cap: " + route[i][1].toFixed(4) + "</li>";
  }

  //Creation de la map
  var map = myMap();

  //Déclaration du tableau contenant le plan de vol
  var flightPlan = [];

  //Pour chaque etapes, on met un marqueur sur la map et on ajoute le point au plan de vol
  for (var i = 0; i < route.length; i++) {
    new google.maps.Marker({
      map: map,
      position: {lat: route[i][0][0], lng: route[i][0][1]},
      title: 'Changement de cap ' + i,
    });
    //Ajout de la coordonnée dans le plan de vol
    flightPlan.push({lat: route[i][0][0], lng: route[i][0][1]})
  }
  //Ajout du marqueur d'arrivée
  var arrivee = new google.maps.Marker({
    map: map,
    position: {lat: inputArriveeLat, lng: inputArriveeLong},
    title: 'Arrivée',
  });

  //Ajout du point d'arrivee sur le plan de vol
  flightPlan.push({lat: inputArriveeLat, lng: inputArriveeLong})

  //Tracer les lignes entres les coordonnées du plan de vol
  var flightPath = new google.maps.Polyline({
    path: flightPlan,
    geodesic: true,
    strokeColor: "#0000FF",
    strokeOpacity: 0.8,
    strokeWeight: 2
  })
  flightPath.setMap(map);

  console.log(flightPlan);
}

function myMap() {
  //On affiche une map vide
  var mapCanvas = document.getElementById("map");
  var mapOptions = {
    center: new google.maps.LatLng(51.508742,-0.120850),
    zoom: 5
  };

  var map = new google.maps.Map(mapCanvas, mapOptions);
  return map
}
