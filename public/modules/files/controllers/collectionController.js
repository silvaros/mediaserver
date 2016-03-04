'use strict';

angular.module('files').controller('CollectionController', ['$scope', '$http', '$stateParams', 'Authentication',
	function($scope, $http, $stateParams, Authentication) {
		$scope.collectionName = $stateParams.collectionName;
			
		$http.get('/collections/'+ $scope.collectionName).success(
			function(data, status, headers, config) {
				$scope.files = data.files;
			}
		);
	}
]);