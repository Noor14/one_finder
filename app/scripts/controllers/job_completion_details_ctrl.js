app.controller('JobCompletionDetailsCtrl',['$scope','job_completion_details',
    function($scope,job_completion_details){
    
        $scope.show_completion_notes_text    = job_completion_details.completionNote;
        $scope.show_completion_notes_photos  = job_completion_details.photos; 
        $scope.slides = [];
        $scope.show_completion_notes_photos.forEach(function(pic,index){
            $scope.slides.push({id:index,image:pic.url})
        })    
        $scope.close_completion_note_box = function(){
            $scope.closeThisDialog();     
        }    
  }
]);
