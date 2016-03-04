'use strict';

angular.module('core').controller('IndexController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		$scope.authentication = Authentication;
		if($scope.authentication.user != ''){
			$location.path('/home');
		}
	}
]);