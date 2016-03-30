angular.module('starter.services', [])

.factory('DataStore', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('Poets', function($http, $q, $timeout, Settings) {
  var poets = null;
  return {
    all: function() {
        return $http.get(Settings.getSyncingServerUrl()+'poets');
    },
    set: function(jsonArr) {
      poets = jsonArr;
    },
    remove: function(poet) {
      poets.splice(poets.indexOf(poet), 1);
    },
    get: function(poetId) {
      for (var i = 0; i < poets.length; i++) {
        if (parseInt(poets[i].id) === parseInt(poetId)) {
          return poets[i];
        }
      }
      alert('poet :( not found');
      return null;
    }
  };
})

.factory('Poems', function($http, $q, $timeout, Settings) {
  var poems = null;
  return {
    all: function($poetId) {
        return $http.get(Settings.getSyncingServerUrl()+'poets/'+$poetId+'/poems');
    },
    set: function(jsonArr) {
      poems = jsonArr;
    },
    remove: function(poem) {
      poems.splice(poems.indexOf(poem), 1);
    },
    get: function(poemId) {
      for (var i = 0; i < poems.length; i++) {
        if (parseInt(poems[i].id) === parseInt(poemId)) {
          return poems[i];
        }
      }
      alert('poet :( not found');
      return null;
    }
  };
})

.factory('Settings', function(DataStore) {
  var settings = {
    enableSyncing: true,
    syncingServerUrl: ''
  };
  
  settings.syncingServerUrl = DataStore.get('syncingServerUrl', 'http://witr.net/heartbeat/api/hb.php/hbcore/');
  
  return {
    all: function() {
      return settings;    
    },
    isSyncingEnabled: function() {
        return settings.enableSyncing;
    },
    getSyncingServerUrl: function() {
        return settings.syncingServerUrl;
    },
    setSyncingServerUrl: function(url) {
        settings.syncingServerUrl = url;
        DataStore.set('syncingServerUrl', url)
    }
  };
});
