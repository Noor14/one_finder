$scope.openModalImage = function (imageSrc, imageDescription) {
  $modal.open({
    templateUrl: "views/modalImage.html",
    resolve: {
      imageSrcToUse: function () {
        return imageSrc;
      },
      imageDescriptionToUse: function () {
        return imageDescription;
      }
    },
    controller: [
      "$scope", "imageSrcToUse", "imageDescriptionToUse",
      function ($scope, imageSrcToUse, imageDescriptionToUse) {
        $scope.ImageSrc = imageSrcToUse;
        return $scope.ImageDescription = imageDescriptionToUse;
      }
    ]
  });
};
