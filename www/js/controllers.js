angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, Settings) {

    $scope.settings = Settings.all();
    $scope.onSearchValueChange = function () {
      Settings.setSearchValue($scope.settings.searchValue);
      $scope.$broadcast('searchValueChange', $scope.settings.searchValue);
    };
    $scope.resetSearchValue = function () {
      $scope.settings.searchValue = '';
      Settings.setSearchValue($scope.settings.searchValue);
      $scope.$broadcast('searchValueChange', $scope.settings.searchValue);
    };

    $scope.languages = [
      {label: "عربي", code: "ar"},
      {label: "Français", code: "fr"},
      {label: "English", code: "en"}
    ];

    $scope.onLangChange = function (lang) {
      if (lang !== Settings.getLang()) {
        $scope.$broadcast('langChange', $scope.settings.lang);
      }
      Settings.setLang(lang.code);
    };

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
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('PoetlistsCtrl', function ($scope, Poets, DataStore, Settings) {
    $scope.selectedLang = Settings.getLang();
    $scope.noMoreItemsAvailable = false;

    poets = null;
    poetsLang = null;
    poetsToDisplay = null;
    lastLoadedPoetsIndex = 0;

    switchPoetsLang = function (lang) {
      Poets.all(false, lang).then(function (resp) {
        console.log("poets: " + JSON.stringify(resp.data));
        DataStore.setObject('poets.' + lang, resp.data);
        poets = resp.data;
        Poets.set(poets);
        poetsLang = poets.items.filter(function (poet) {
          return poet.lang.toLowerCase() === $scope.selectedLang;
        });
        poetsToDisplay = poetsLang;
        initDisplayPoets();
      });
    }

    initDisplayPoets = function () {
      $scope.poets = [];
      lastLoadedPoetsIndex = 0;
      if (poetsToDisplay !== null && poetsToDisplay.length > 0) {
        $scope.poets.push.apply($scope.poets, poetsToDisplay.slice(0, 50));
        lastLoadedPoetsIndex = 50;
      }
    };

    $scope.loadMore = function () {
      if (poetsToDisplay !== null && poetsToDisplay.length > 0) {
        if (lastLoadedPoetsIndex < poetsToDisplay.length) {
          $scope.poets.push.apply($scope.poets, poetsToDisplay.slice(lastLoadedPoetsIndex, lastLoadedPoetsIndex + 50));
          lastLoadedPoetsIndex += 50;
        } else {
          $scope.noMoreItemsAvailable = true;
        }
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.doRefresh = function () {
      Poets.all(true, $scope.selectedLang).then(function (resp) {
        console.log("poets: " + JSON.stringify(resp.data));
        DataStore.setObject('poets.' + $scope.selectedLang, resp.data);
        poets = resp.data;
        Poets.set(poets);
        poetsLang = poets.items.filter(function (poet) {
          return poet.lang.toLowerCase() === $scope.selectedLang;
        });
        poetsToDisplay = poetsLang;
        initDisplayPoets();
      })
        .finally(function () {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.$on('langChange', function (evt, newLang) {
      $scope.selectedLang = Settings.getLang();
      switchPoetsLang($scope.selectedLang);
    });

    $scope.$on('searchValueChange', function (evt, q) {
      if (q.trim() === '') {
        poetsToDisplay = poetsLang;
      } else {
        poetsToDisplay = poetsLang.filter(function (poet) {
          return poet.name.toLowerCase().indexOf(q.trim().toLowerCase()) > -1;
        });
      }
      initDisplayPoets();
    });

  })

  .controller('PoemlistsCtrl', function ($scope, $stateParams, Poets, Poems, DataStore) {
    $scope.poet = Poets.get($stateParams.poetId);
    poems = DataStore.getObject('poems_of_' + $stateParams.poetId);
    if (poems !== null) {
      console.log(JSON.stringify(poems));
      Poems.set(poems);
      $scope.poems = poems;
    } else {
      Poems.all($stateParams.poetId).then(function (resp) {
        console.log(JSON.stringify(resp.data));
        DataStore.setObject('poems_of_' + $stateParams.poetId, resp.data);
        Poems.set(resp.data);
        $scope.poems = resp.data;
      });
    }

    $scope.doRefresh = function () {
      Poems.all($stateParams.poetId).then(function (resp) {
        console.log(JSON.stringify(resp.data));
        DataStore.setObject('poems_of_' + $stateParams.poetId, resp.data);
        Poems.set(resp.data);
        $scope.poems = resp.data;
      })
        .finally(function () {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });
    };
  })

  .controller('PoemCtrl', function ($scope, $stateParams, Poets, Poems) {

    $scope.poet = Poets.get($stateParams.poetId);
    $scope.poem = Poems.get($stateParams.poemId);

  })

  .controller('SettingsCtrl', function ($scope, $ionicHistory, Settings) {
    $scope.settings = Settings.all();

    $scope.onSyncingServerUrlChange = function () {
      Settings.setSyncingServerUrl($scope.settings.syncingServerUrl);
    };

  });
