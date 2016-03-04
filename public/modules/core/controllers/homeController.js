'use strict';

angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication',
	function($scope, $http, Authentication) {
		$scope.authentication = Authentication;
			
		$scope.uiState = 'mine';
		$scope.stateLabel = '';
		// list of popular collections / files
		$scope.$watch('uiState', function(newVal, oldVal, s){
				$scope.collections = [];
				
				switch(newVal){
				case 'mine':
					$scope.stateLabel = 'My Collections';
					$http.get('/api/user/' + Authentication.user.userName).success(function(res){
						if(_.size(res) > 0)
							$scope.collections = res;
						else
							$scope.errMsg = "No Collections Found";
					});
					break;
				case 'all':
					$scope.stateLabel = 'Shared Collections';
					$http.get('/api/collections').success(function(res){
						if(_.size(res) > 0)
							$scope.collections = res;
						else
							$scope.errMsg = "No Collections Found";
					});
					break;
				case 'search':
					$scope.stateLabel = 'Search Collections';
					$scope.errMsg = "No Search Found";
				case '':
					$scope.stateLabel = 'Uers';
					$scope.errMsg = "No Users Found";
			}
		});

		$scope.getCollectionCount = function(){
			return _.size($scope.collections);
		}

		$scope.getActiveCss = function(state){
			return { active: state === $scope.uiState};
		}

		$scope.onNavLinkClick = function(newState){
			$scope.uiState = newState;
		}

		// who has viewed what

		// near by users

		// connection information

		// friends list

		// my collections / files - need design work!


		// locking/ed files

	}
]);