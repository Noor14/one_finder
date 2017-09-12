

angular.module('onefindrApp')
  .service('Map', function () {
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
  });
