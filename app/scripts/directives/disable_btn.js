angular.module('onefindrApp').directive('a',function() {
  return {
    restrict: 'E',
    link: function(scope,el) {
      var $el = angular.element(el);
      $el.bind('click', function(event) {
        if($el.attr('disabled')) {
          event.stopImmediatePropagation();
        }
      });
    }
  }
});
