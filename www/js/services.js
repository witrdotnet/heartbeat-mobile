angular.module('starter.services', [])

  .factory('DataStore', ['$window', function ($window) {
      return {
        set: function (key, value) {
          $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
          return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
          $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
          return JSON.parse($window.localStorage[key] || 'null');
        }
      }
    }])

  .factory('Poets', function ($http, $q, Settings, DataStore) {
    var poets = null;
    return {
      all: function (forceReloadFromServer, lang) {
        reloadFromServer = forceReloadFromServer || false;
        poets = DataStore.getObject('poets.' + lang);
        if (!reloadFromServer && poets !== null) {
          var defer = $q.defer();
          defer.resolve({"data": poets});
          return defer.promise;
        } else {
          return $http.get(Settings.getSyncingServerUrl() + 'poets/' + lang);
        }
      },
      set: function (jsonArr) {
        poets = jsonArr;
      },
      remove: function (poet) {
        poets.items.splice(poets.items.indexOf(poet), 1);
      },
      get: function (poetId) {
        console.log("getPoet poetId:" + poetId +  " from:" + poets);
        for (var i = 0; i < poets.items.length; i++) {
          if (parseInt(poets.items[i].poetId) === parseInt(poetId)) {
            return poets.items[i];
          }
        }
        alert('poet :( not found');
        return null;
      }
    };
  })

  .factory('Poems', function ($http, $q, $timeout, Settings) {
    var poems = null;
    return {
      all: function ($poetId) {
        return $http.get(Settings.getSyncingServerUrl() + 'poems/' + $poetId);
      },
      set: function (jsonArr) {
        poems = jsonArr;
      },
      remove: function (poem) {
        poems.items.splice(poems.items.indexOf(poem), 1);
      },
      get: function (poemId) {
        for (var i = 0; i < poems.items.length; i++) {
          if (parseInt(poems.items[i].poemId) === parseInt(poemId)) {
            return poems.items[i];
          }
        }
        alert('poem :( not found');
        return null;
      }
    };
  })

  .factory('Settings', function (DataStore) {
    var settings = {
      enableSyncing: true,
      syncingServerUrl: '',
      lang: '',
      searchValue: ''
    };

    settings.syncingServerUrl = DataStore.get('syncingServerUrl', 'http://witr.net/heartbeat/api/hb.php/hbcore/');
    settings.lang = DataStore.get('lang', 'ar');

    return {
      all: function () {
        return settings;
      },
      isSyncingEnabled: function () {
        return settings.enableSyncing;
      },
      getSyncingServerUrl: function () {
        return settings.syncingServerUrl;
      },
      setSyncingServerUrl: function (url) {
        settings.syncingServerUrl = url;
        DataStore.set('syncingServerUrl', url);
      },
      getLang: function () {
        return settings.lang;
      },
      setLang: function (lang) {
        settings.lang = lang;
        DataStore.set('lang', lang);
      },
      getSearchValue: function () {
        return settings.searchValue;
      },
      setSearchValue: function (searchValue) {
        settings.searchValue = searchValue;
        DataStore.set('searchValue', searchValue);
      }
    };
  });
