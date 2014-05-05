'use strict';

angular.module('eversnapApp')
  .controller('MainCtrl', ['$scope', "$rootScope", '$q', 'Facebook', function ($scope, $rootScope, $q, Facebook) {
    $scope.awesome = 'aaa';
    $scope.loggedIn = undefined;
    $scope.user = undefined;
    $scope.albums = undefined;
    //var deferred = $q.defer();


    $scope.$watch(function() {
    	return Facebook.isReady(); // This is for convenience, to notify if Facebook is loaded and ready to go.
  	}, function(newVal) {
    $scope.facebookReady = true; // You might want to use this to disable/show/hide buttons and else
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
    		$scope.getLoginStatus();
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
	    "/me/albums",
	    function (response) {
	    	if (response && !response.error) {
	    		//var promise = deferred.promise.then($scope.albumCover);
	    		 //for(var i = 0; i<response.data.length; i++){
	    		//  	console.log('aaa');
	    		//  	deferred.resolve(response.data[i].cover_photo);
	    		//  	$rootScope.$apply();
	    			//$scope.albumCover(response.data[i].id,i);
	    		 //}
	    		
	    		$scope.albums = response.data;
	    		//$scope.albumCover(response.data);
	    	}
	    	console.log(response.data);
	    	//console.log(promise);
	    })
    };
    $scope.prova = function(val){
    	$scope.isActive = undefined;
    }

    $scope.loadPhoto = function(albumId){
    	console.log(albumId);
    	Facebook.api(
	    '/'+albumId+'/photos',
	    function (response) {
	    	if (response && !response.error) {
	    		$scope.isActive = true;
	    		console.log(response.data);
	    		$scope.photos = response.data;
	    		
	    	}
	    	
	    })
    };

    // $scope.albumCover = function(newValue, albumsId, scope){
    // 	for(var i = 0; i<albumsId.length; i++){
    // 		console.log(albumsId[i]);
	   //  	Facebook.api(
	   //  		'/'+albumsId[i].id+'/picture',
	   //  		function(response){
	   //  			if (response && !response.error) {
			 //    		//$scope.albums[i].photo = response.data.url;
			 //        	console.log(response.data.url);
		  //   		}
	   //  		})
	   //  }
    // };
    





  }]);
