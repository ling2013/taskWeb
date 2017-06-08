/**
 * Created by ling on 17/1/24.
 */
//新建一个module
var myApp = angular.module("myApp", ["ui.bootstrap","ui.router","task.controller","app.directive","app.server"]);

//全局配置
myApp.constant('baseConfig', {
    "baseUrl": "http://localhost:2020/task"
});

//基本配置
myApp.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.when('/index', ['$state','dataServer', function ($state,dataServer) {
        $state.go('main');
        //var userid = util.CookieHelper.getCookie('loginuserid');
        //
        //console.log('dfdf');
        //console.log('获取用户信息');
        //if(userid){
        //    $state.go('main');
        //}else{
        //    $state.go('assign.login');
        //}
    }]).otherwise('/main');
    $stateProvider.state('main', {
        url: '/main',
        templateUrl: './views/main.html',
        controller:'taskController'
    }).state('detail',{
        url:'/detail/:eventId',
        templateUrl:'./views/detail.html',
        controller:'taskDetailController'
    }).state('track',{
        url:'/track/:eventid',
        templateUrl:'./views/track.html',
        controller:'trackController'
    })
}]);
myApp.run(function () {
    console.log('开始运行');
});
