function Map() {
  var map = {
    setCoords: setCoords,
    coords: {
      latitude: 0,
      longitude: 0
    }
  };
  return map;

  function setCoords(coords) {
    map.coords = coords;
  }
}

angular.module('onefindrApp')
  .service('Map', Map);
