'use strict';

// Setting up route
angular.module('files').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('collection', {
			url: '/collections/:collectionName',
			templateUrl: 'modules/files/views/collection.html'
		})
	}
]);