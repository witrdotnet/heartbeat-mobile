angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PoetlistsCtrl', function($scope, Poets) {
    
  Poets.all().then(function(resp){
      console.log(JSON.stringify(resp.data));
      Poets.set(resp.data);
      $scope.poets = resp.data;
  });
  $scope.doRefresh = function() {
    Poets.all().then(function(resp){
        console.log(JSON.stringify(resp.data));
        Poets.set(resp.data);
        $scope.poets = resp.data;
    })
    .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
})

.controller('PoemlistsCtrl', function($scope, $stateParams, Poets, Poems) {
  $scope.poet = Poets.get($stateParams.poetId);
            
  Poems.all($stateParams.poetId).then(function(resp){
      console.log(JSON.stringify(resp.data));
      Poems.set(resp.data);
      $scope.poems = resp.data;
  });
  $scope.doRefresh = function() {
    Poems.all($stateParams.poetId).then(function(resp){
        console.log(JSON.stringify(resp.data));
        Poems.set(resp.data);
        $scope.poems = resp.data;
    })
    .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
})

.controller('PoemCtrl', function($scope, $stateParams, Poets, Poems) {
    
  $scope.poet = Poets.get($stateParams.poetId);
  $scope.poem = Poems.get($stateParams.poemId);
  
})

.controller('SettingsCtrl', function($scope, Settings) {
  $scope.settings = Settings.all();
  $scope.onSyncingServerUrlChange = function() {
    Settings.setSyncingServerUrl($scope.settings.syncingServerUrl);  
  };
});
