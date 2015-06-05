'use strict';

angular.module('App', []);

angular.module('App')
    .controller('AppController', [
        '$scope', '$window', function ($scope, $window) {
            $scope.datasource = [];
            //number of records to fetch when getMore is called.
            var loadCount = 1000;

            $scope.getMore = function () {
                var maxCount = $scope.datasource.length + loadCount;
                for (var i = $scope.datasource.length; i <= maxCount; i++) {
                    if (i < $window.hamletScripts.length) {
                        $scope.datasource.push($window.hamletScripts[i]);
                    }
                }
            };

            function SetPreloaded() {
                //pre load all data
                $scope.datasource = $window.hamletScripts;
                $scope.preloaded = true;
            }

            function SetAsyncLoad() {
                //set async load and only pre-load first 1000 rows
                $scope.getMore();
                $scope.preloaded = false;
            }

            SetAsyncLoad();
            //SetPreloaded();
        }
    ]);

angular.module('App')
    .directive('scrollableTable', ['$compile', '$templateCache',
        function ($compile, $templateCache) {
            return {
                restrict: 'EA',
                scope: {
                    datasource: "=",   //datasource
					templateid: "@",   //dynamic template id
                    preloaded: "=",    //is all the data pre-loaded?
                    loadfn: "&"        //is async load, function to call when get more.
                },
                //link the events of the directive.
                //render dynamic template
                link: function (scope, element) {
                    var template = $templateCache.get(scope.templateid);
                    element.html(template);
                    $compile(element.contents())(scope);
                    
                    if (!scope.preloaded) {
                        var visibleHeight = element.height();
                        var threshold = 100;

                        element.scroll(function () {
                            //logic to get more when scrolled to the bottom
                            var scrollableHeight = element.prop('scrollHeight');
                            var hiddenContentHeight = scrollableHeight - visibleHeight;

                            if (hiddenContentHeight - element.scrollTop() <= threshold) {
                                if (!scope.preloaded) {
                                    scope.loadfn()();
                                    scope.$apply();
                                }
                            }
                        });
                    }
                }
            };
        }
    ]);