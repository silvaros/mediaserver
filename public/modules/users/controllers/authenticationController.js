'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$window', '$http', '$location', 'Authentication',
	function($scope, $window, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/home');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				
				// TODO: fix this hack to get the username to show in the header after login.
				$window.location.reload();
				// And redirect to the index page
				$location.path('/home');



			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);