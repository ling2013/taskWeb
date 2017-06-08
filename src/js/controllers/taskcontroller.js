/**
 * Created by ling on 16/12/6.
 */

var taskCtrl = angular.module('task.controller',['app.server']);

taskCtrl.controller("taskController",["$scope","$state","getTask","dateOperation","$modalStack",function($scope,$state,getTask,dateOperation){

    $scope.params = {
        carBrand:'',
        mobilePhone:'',
        entName:'',
        code:'',
        pageNo:1,
        pageSize:10
    };
    $scope.taskList = [];
    $scope.showloading = false;
    var getList = function(params){
        $scope.showloading = true;
        console.log('显示');
        getTask.taskList(params).then(function(data){
            $scope.showloading = false;
            if(data.success){
                console.log(data.result.data);
                if(!data.result.empty){
                    console.log(data);
                    for(var item in data.result.data){
                        console.log(item);
                        if(data.result.data[item].createTime){
                            data.result.data[item].createTime =dateOperation.dateformat(new Date(data.result.data[item].createTime),'yyyy-MM-dd hh:mm:ss')
                        }
                    }
                    $scope.taskList = data.result.data;

                    $scope.paginationConf.totalItems = data.result.total;
                }else{
                    console.log('暂无数据');
                }
            }else{
                console.log(data);
                if(data.warnMessage.length!=0){
                    alert(data.warnMessage);
                }else{
                    alert(data.error);
                }
            }
        },function(error){
            console.log('隐藏');
            $scope.showloading = false;
        });
    };

    $scope.filter = function(){

        if(!$scope.params.carBrand && !$scope.params.mobilePhone && !$scope.params.entName && !$scope.params.code){
            alert('请输入任意一个搜索条件，点击搜索');
            return ;
        }else{
            $scope.params.pageNo = 1;
            getList($scope.params);
        }
    }

    $scope.jumpTo = function(eventId){
        $state.go('detail',{eventId:eventId});
    }

    $scope.paginationConf = {
        currentPage: 1,
        totalItems: '',
        itemsPerPage: 10,
        pagesLength: 9,
        perPageOptions: '',
        onChange: function () {
            $scope.params.pageNo = $scope.paginationConf.currentPage;
            $scope.params.pageSize = $scope.paginationConf.itemsPerPage;
            getList($scope.params);
        }
    };



}]);

taskCtrl.controller('taskDetailController', ['$scope',"$state","getTask","$modal","$log","getTask",function ($scope,$state,getTask,$modal,$log,getTask) {
    var params = {
        eventId:$state.params['eventId']
    };
    $scope.detailList = [];
    $scope.showloading = true;
    var getDetail = function(params){
        console.log('显示');
        getTask.taskDetail(params).then(function(data){
            $scope.showloading = false;
            console.log('隐藏');
            if(data.success){
                if(data.result.length!=0){
                    $scope.detailList =  data.result;
                }else{
                    console.log('暂无数据');
                }
            }else{
                console.log(data);
                if(data.warnMessage){
                    alert(data.warnMessage);
                }else{
                    alert(data.error);
                }
            }
        },function(error){
            $scope.showloading = false;
            console.log(error);
        });
    };
    getDetail(params);

    $scope.showModify = function(eventId,eventType){
            var title = eventType==0?'修改发车时间':eventType==7?'修改到达时间':'';
            var paramsObj = {
                eventId:eventId,
                eventType:eventType,
                title:title,
                modifyTime:''
            }

            var modalInstance = $modal.open({
                templateUrl : 'myModelContent.html',
                controller : 'ModalInstanceCtrl', // specify controller for modal
                resolve : {
                    paramsObj:function(){
                        return paramsObj;
                    }
                }
            });
            // modal return result
            modalInstance.result.then(function(data) {
                $scope.paramsObj = data;
                $scope.modifyParams = {
                    spaceId:data.eventId,
                    currentTime:data.modifyTime
                };
                $scope.showloading = true;
                getTask.modify($scope.modifyParams).then(function(data){
                    $scope.showloading = false;
                    if(data.success){
                        alert('修改成功');
                        window.location.reload();
                    }else{
                        if(data.warnMessage.length!=0){
                            alert(data.warnMessage);
                        }else{
                            alert(data.error);
                        }
                    }

                },function(){
                    $scope.showloading = false;
                });

            }, function() {
                $log.info('Modal dismissed at: ' + new Date())
            });
    }

}]);
taskCtrl.controller('trackController', ['$scope','getTask','$state',function ($scope,getTask,$state) {
    var params = {
        spaceId:$state.params['eventid'],
        pageNo:1,
        pageSize:10
    }
    $scope.trackList = [];
    $scope.showloading = true;
    var getList = function(params) {
        console.log('显示');
        getTask.track(params).then(function(data){
            $scope.showloading = false;
            console.log('隐藏');
            if(data.success){
                console.log(data.result.data);
                if(!data.result.empty){
                    console.log(data);
                    $scope.trackList = data.result.data;
                    $scope.paginationConf.totalItems = data.result.total;
                }else{
                    console.log('暂无数据');
                }
            }else{
                console.log(data);
                if(data.warnMessage.length!=0){
                    alert(data.warnMessage);
                }else{
                    alert(data.error);
                }
            }


        },function(error){
            $scope.showloading = false;
            console.log(error);
        })
    };
    getList(params);

    $scope.paginationConf = {
        currentPage: 1,
        totalItems: '',
        itemsPerPage: 10,
        pagesLength: 9,
        perPageOptions: '',
        onChange: function () {
            params.pageNo = $scope.paginationConf.currentPage;
            params.pageSize = $scope.paginationConf.itemsPerPage;
            getList(params);
        }
    };
}]);
taskCtrl.controller('ModalInstanceCtrl',['$scope','$modalInstance','paramsObj',function($scope, $modalInstance, paramsObj) {
    $scope.paramsObj = paramsObj;
    $scope.ok = function() {
        $modalInstance.close($scope.paramsObj);
    };
    // cancel click
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
}]);