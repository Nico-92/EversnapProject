'use strict';

angular.module('eversnapApp')
  .controller('MainCtrl', ['$scope', "$rootScope", '$modal', 'Facebook', function ($scope, $rootScope, $modal, Facebook) {
    $scope.loggedIn = undefined;
    $scope.isError = { active: 'false', message: ''};

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
    /* When I load the page I call getLoginStatus() to initialize loggedIn, user and albums */
    $scope.getLoginStatus();
	

    /* Logout API take care to logout user, then I set loggedIn to false*/ 
    $scope.logout = function() {
    	Facebook.logout(function(response){
    		$scope.loggedIn = false;
    	})
    };

    /* The onlogin facebook's function must be on window scope to work*/
    window.login = function() { 
    	$scope.getLoginStatus();
    };

    /* Loads the albums */
    $scope.albums = function(){
    	Facebook.api(
	    '/me/albums',
	    function (response) {
	    	if (response && !response.error) {
	    		$scope.albums = response.data;
	    	}
	    	else{
	    		$scope.isError.active = true;
	    		$scope.isError.message = response;
	    	}
	    })
    };

    /* Manage the Albums and Photo tabs activations*/
    $scope.returnToAlbum = function(){
    	$scope.isActive = undefined;
    };

    /* Loads the photo of an album, and change tab fromalbums to photos*/
    $scope.loadPhoto = function(albumId, albumName){
    	Facebook.api(
	    '/'+albumId+'/photos',
	    function (response) {
	    	if (response && !response.error) {
	    		$scope.isActive = true;
	    		response.data.albumName = albumName;
	    		$scope.photos = response.data;
	    		
	    	}else{
	    		$scope.isError.active = true;
	    		$scope.isError.message = response;
	    	}
	    	
	    })
    };

    /* Function of$modal service, open the bootstrap modal*/
    $scope.open = function (size, photoId) {
	    var modalInstance = $modal.open({
	    	templateUrl: 'popup.html',
	      	controller: ModalInstanceCtrl,
	      	size: size,
	      	resolve: {
	        	photoId: function () {
	          	return photoId;
	        	}
	    	}
	    });
  	};

  }]);



var ModalInstanceCtrl = function ($scope, $modalInstance, photoId, Facebook) {
	/* Retrieve photo info*/
	Facebook.api(
    '/'+photoId,
    function (response) {
	    if (response && !response.error) {
	        $scope.photo = response;
	    }  
    }
	);
	/* Retrieve photo likes*/
	Facebook.api(
    '/'+photoId+'/likes',
    function (response) {
	    if (response && !response.error) {
	        $scope.likes = response.data;
	    }  
    }
	);
	/* Retrieve photo comments */
	Facebook.api(
    '/'+photoId+'/comments',
    function (response) {
	    if (response && !response.error) {
	        $scope.comments = response.data;
	    }  
    }
	);

	/* Close modal */
	$scope.cancel = function () {
    	$modalInstance.dismiss('cancel');
  	};
};