var dBoss = angular.module('DBoss', ['ui.bootstrap', 'ui.router', 'ngCookies']);
require('router');
/**
 * Master Controller
 */

dBoss.controller('MasterCtrl', function ($scope, $cookieStore) {
    require.async(['common/sidebar/ace_extra']);
    require('partial/sidebar/side_bar');
});