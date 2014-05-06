'use strict';

angular.module('eversnapApp')
  .controller('MainCtrl', ['$scope', "$rootScope", '$modal', 'Facebook', function ($scope, $rootScope, $modal, Facebook) {
    $scope.awesome = 'aaa';
    $scope.loggedIn = undefined;
    $scope.user = undefined;
    $scope.albums = undefined;
    $scope.photo = undefined;


    $scope.$watch(function() {
    	return Facebook.isReady(); 
  	}, function(newVal) {
    $scope.facebookReady = true;
  	});

	$scope.getLoginStatus = function() {
	    Facebook.getLoginStatus(function(response) {
	    	if(response.status == 'connected') {
        		$scope.$apply(function() {
          		$scope.loggedIn = true;
          		$scope.user = response;
          		$scope.albums();
        	});
      		}
      		else {
        		$scope.$apply(function() {
          		$scope.loggedIn = false;
        	});
      		}
	    })
    };

	$scope.getLoginStatus();


    $scope.logout = function() {
    	Facebook.logout(function(response){
    		$scope.loggedIn = false;
    	})
    };
    window.login = function() { 
    	$scope.getLoginStatus();
    };

    $scope.me = function() {
      Facebook.api('/user.accessToken', function(response) {
        $scope.$apply(function() {
          // Here you could re-check for user status (just in case)
          $scope.user = response;
        });
      });
    };

     //$scope.me();
    $scope.albums = function(){
    	Facebook.api(
	    '/me/albums',
	    function (response) {
	    	if (response && !response.error) {
	    		$scope.albums = response.data;
	    		//console.log(response.data);
	    	// 	for (var album in response.data) {
	    	// 		Facebook.api('/'+response.data[album].id + '/picture', 
	    	// 			function(coverResponse) {
	    	// 				$scope.albums[album].cover_photo = coverResponse.data.url;
      //   				}
      //   			);
	    	// 	}
	    	// 	$scope.albums = response.data;
	    	// 	console.log($scope.a);
	    	}
	    })
    };
    $scope.returnToAlbum = function(){
    	$scope.isActive = undefined;
    };

    $scope.loadPhoto = function(albumId, albumName){
    	console.log(albumId);
    	Facebook.api(
	    '/'+albumId+'/photos',
	    function (response) {
	    	if (response && !response.error) {
	    		$scope.isActive = true;
	    		response.data.albumName = albumName;
	    		$scope.photos = response.data;
	    		
	    	}
	    	
	    })
    };

    $scope.prova = function(){
    	alert();
    }

    $scope.open = function (size, photoId) {
    var modalInstance = $modal.open({
      templateUrl: 'popup.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        items: function () {
          return photoId;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });
  };
    





  }]);
var ModalInstanceCtrl = function ($scope, $modalInstance, items, Facebook) {
	Facebook.api(
    '/'+items,
    function (response) {
	    if (response && !response.error) {
	        $scope.photo = response;
	    }  
    }
	);
	Facebook.api(
    '/'+items+'/likes',
    function (response) {
	    if (response && !response.error) {
	        $scope.likes = response.data;
	    }  
    }
	);
	Facebook.api(
    '/'+items+'/comments',
    function (response) {
    	console.log(response.data);
	    if (response && !response.error) {
	        $scope.comments = response.data;
	    }  
    }
	);

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};