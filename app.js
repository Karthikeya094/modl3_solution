var app = angular.module('NarrowItDownApp', []);

app.controller('NarrowItDownController', ['MenuSearchService', function(MenuSearchService) {
    var ctrl = this;
    ctrl.searchTerm = '';
    ctrl.foundItems = [];

    ctrl.narrowItDown = function() {
        if (ctrl.searchTerm) {
            MenuSearchService.getMatchedMenuItems(ctrl.searchTerm).then(function(items) {
                ctrl.foundItems = items;
            });
        } else {
            ctrl.foundItems = [];
        }
    };

    ctrl.removeItem = function(index) {
        ctrl.foundItems.splice(index, 1);
    };
}]);

app.service('MenuSearchService', ['$http', function($http) {
    this.getMatchedMenuItems = function(searchTerm) {
        return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
            .then(function(response) {
                var items = response.data;
                var foundItems = [];
                for (var key in items) {
                    if (items[key].description.indexOf(searchTerm) !== -1) {
                        foundItems.push(items[key]);
                    }
                }
                return foundItems;
            });
    };
}]);

app.directive('foundItems', function() {
    return {
        restrict: 'E',
        scope: {
            found: '<',
            onRemove: '&'
        },
        template: `
            <li ng-repeat="item in found">
                <span>{{ item.name }}, {{ item.short_name }}, {{ item.description }}</span>
                <button ng-click="onRemove({index: $index})">Don't want this one!</button>
            </li>
        `
    };
});
