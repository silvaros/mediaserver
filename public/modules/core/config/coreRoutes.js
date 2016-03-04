'use strict';
// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider
		.state('index', {
			url: '/',
			templateUrl: 'modules/core/views/index.html'
		})
		.state('home', { 
			url: '/home',
			templateUrl: 'modules/core/views/home.html'
		})
	}
]);