'use strict';

var index = require('pages/index/index');
var tables = require('pages/tables/tables');
/**
 * Route configuration for the RDash module.
 */
angular.module('DBoss').config(function ($stateProvider, $urlRouterProvider) {

    // Application routes
    $stateProvider
        .state('index', index)
        .state('tables', tables);
    // For unmatched routes*/
    $urlRouterProvider.otherwise('/');
});