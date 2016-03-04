'use strict';


function onDirLinkClick(){
	this.collapseKids = !this.collapseKids;
}

function onFileLinkClick(userId, fileId){
	var player = $('video');
	// if this was already selected
	if(this.selected){
		// un-selected it, removing the video player
		this.selected = false;
		return;
	}

	// if there is a video player on the page for a different link
	if(player.length === 1){
		// get the scope and un-selected it
		angular.element(player.parent().parent()[0].firstChild).scope().selected = false;
	}

	if(!this.selected){
		// set the link selected, showing the video player
		this.selected = true;
	}
};

// Setting up route
angular.module('files').directive("tree", function($compile) {
    return {
        restrict: "E",
        scope: {family: '='},
        template: 
        	'<div ng-if="isDir === true && hideName === false">'+
			'	<span class="dirName" ng-click="onDirLinkClick()">{{::linkText}}</span>'+
			'   <ul ng-class="{collapsed: collapseKids}">'+
			'   	<li ng-if="!collapseKids" ng-repeat="child in kids">'+
			'			<tree family="child"></tree>'+
			'		</li>'+
			'   </ul>'+
			'</div>'+

			'<div class="fileLinkContainer" ng-if="isDir !== true || hideName !== false" ng-class="{selected: selected}" >'+
				'<div class="fileLink" href="" ng-click="onFileLinkClick()">{{::linkText}}</div>'+
				'<div class="vidPlayer" ng-if="selected === true">'+
					'<video controls autoplay>'+
						'<source ng-src="{{vidUrl}}" type="video/mp4">'+
					'</video>'+
				'</div>'+
			'</div>'
			,
        compile: function(tElement, link) {
            var contents = tElement.contents().remove();
            var compiledContents;

            return {
            	pre: (link && link.pre) ? link.pre : null,
            	post: function(scope, element, attr) {
	            	if(scope.family){
		            	var kids = scope.family.children,
		            		numKids = _.size(kids),
		            		collectionController = scope.$parent.$parent;

		            	scope.selected = false;
		            	scope.collapseKids = true;
		            	scope.isDir = scope.family.isDir;
				        scope.uuid = scope.family.uuid;
						scope.userName = scope.family.userName;
						scope.kids = kids;
								
				    	// if there is only one child and that child has no children
		            	var firstKidId = _.keys(kids)[0];
		            	scope.hideName = ( numKids === 1 && kids[firstKidId].isDir === undefined );

		            	// these are only used when there is 1 child
						var kidsId = numKids > 0 ? firstKidId : '';
						var kidsName = numKids > 0 ? kids[firstKidId].name : '';

						var useKid = scope.isDir === true && scope.hideName !== false;
						scope.vidUrl = 'vid/' + scope.userName + '/' + (useKid ? kidsId : scope.uuid);
						scope.linkText = useKid ? kidsName : scope.family.name;

						scope.onFileLinkClick = onFileLinkClick;
						scope.onDirLinkClick = onDirLinkClick;
					}
	                
	                if(!compiledContents) {
	                    compiledContents = $compile(contents);
	                }
	                compiledContents(scope, function(clone, scope) {
	                    element.append(clone); 
	                });
	            }
            };
        }
    }
});