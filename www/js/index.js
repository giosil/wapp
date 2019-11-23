$(window).on("navigate",function(event,data){
  if(data.state.direction=="back") {
    console.log('navigate back...');
    if(app) app.onBackKeyDown(event,true);
  }
});
function notificationOpenedCallback(jsonData) {
  app.log('notificationOpenedCallback(' + jsonData + ")...");
  if(localStorage.getItem('j_username') && localStorage.getItem('j_password') && localStorage.getItem('j_iremember')) {
    if("additionalData" in jsonData['notification']['payload']) {
      var odata = jsonData['notification']['payload']['additionalData'];
      console.log("page = \"" + odata.page + "\" id_far = \"" + odata.id_far+"\""); 
      if (odata.id_far) sessionStorage.setItem('selfar_s', odata.id_far);
      if (odata.page && odata.page != "null") login(odata.page); else login(null);
    } 
    else {
      login(null);
    }
  }
};
function notificationReceivedCallback(jsonData) {
  app.log('notificationReceivedCallback(' + jsonData + ")...");
};
function login(page) {
  jrpc.setUserName($('#j_username').val());
  jrpc.setPassword($('#j_password').val());
  app.log('[index] login ' + $('#j_username').val() + '...');
  
  // Execute Login
  
  app.userLogged = $('#j_username').val();
  if ($('#iremeber').is(':checked')) {
    localStorage.setItem('j_username', $('#j_username').val());
    localStorage.setItem('j_password', $('#j_password').val());
    localStorage.setItem('j_iremember', true);
  }
  app.menuIndexSelected = 0;
  app.stopAutoplayMenu = false;

  app.log('[index] changePage("menu.html")...');
  $.mobile.changePage("menu.html");
}
var app = {
  initialize: function() {
    this.reset();
    if(this.initialized) return;
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    this.initialized = true;
  },
  
  reset: function() {
    sessionStorage.clear();
    this.exitOnBackKeyDown = true;
    this.pageOnBackKeyDown = null;
    this.stopAutoplayMenu = false;
    this.menuIndexSelected = 0;
    this.userLogged = null;
    this.userRegistered = null;
    this.lastSearch = null;
    this.lastSearchResult = [];
  },
  
  onDeviceReady: function() {
    this.log('[app] deviceready');
    // window.plugins.OneSignal
    //  .startInit("90516962-0597-4ee9-a7fb-c2c95bd40192")
    //  .handleNotificationReceived(notificationReceivedCallback)
    //  .handleNotificationOpened(notificationOpenedCallback)
    //  .endInit();
    // window.plugins.OneSignal
    //  .getPermissionSubscriptionState(function(status){
    //    j_playerID = status.subscriptionStatus.userId;
    //    localStorage.setItem('j_playerID', JSON.stringify(j_playerID));
    //    this.log('j_playerID=' + localStorage.getItem('j_playerID'));
    //  });
    
    document.addEventListener("pause",      this.onPause.bind(this),       false);
    document.addEventListener("resume",     this.onResume.bind(this),      false);
    document.addEventListener('backbutton', this.onBackKeyDown.bind(this), false);
  },
  
  onResume: function() {
    this.log('[app] resume');
  },
  
  onPause: function() {
    this.log('[app] pause');
  },
  
  onBackKeyDown: function(e,byOnNavigate) {
    var currTime = new Date().getTime();
    var elapsed  = currTime - this.lastBackKeyDown;
    this.lastBackKeyDown = currTime;
    if(elapsed < 400) { // back troppo ravvicinati non vengono elaborati
      this.log('[app] onBackKeyDown prevented');
      if(!byOnNavigate) e.preventDefault();
      return;
    }
    this.log('[app] onBackKeyDown (exit=' + this.exitOnBackKeyDown + ',page=' + this.pageOnBackKeyDown + ',bon=' + byOnNavigate + ')...');
    if(this.exitOnBackKeyDown && !byOnNavigate) {
      if(confirm("Si vuole uscire dall'app?")) {
        navigator.app.exitApp();
      }
    }
    else {
      if(this.pageOnBackKeyDown) {
        this.log('[app] back to ' + this.pageOnBackKeyDown + '...');
        e.preventDefault();
        var page=this.pageOnBackKeyDown;
        this.pageOnBackKeyDown=null;
        $.mobile.changePage(page,{reloadPage:true});
      }
      else {
        if(byOnNavigate) return;
        this.log('[app] window.history.back()...');
        e.preventDefault();
        window.history.back();
      }
    }
  },
  
  onRpcError: function(error) {
    app.log('[app] Error: ' + error.message);
    window.plugins.toast.showWithOptions({
      message:error.message, duration:'short', position:'bottom', styling:{backgroundColor: '#bb0000'}
    });
  },
  
  notifyLogout: function() {
    app.log('[app] notifyLogout (' + app.userLogged + ')');
  },
  
  initialized: false,
  
  userLogged: null,
  
  userRegistered: null,
  
  exitOnBackKeyDown: true,
  
  pageOnBackKeyDown: null,
  
  notificationGranted: false,
  
  notificationTest: false,
  
  stopAutoplayMenu: false,
  
  menuIndexSelected: 0,
  
  lastSearch: null,
  
  lastSearchResult: [],
  
  logmessages: [],
  
  lastBackKeyDown: 0,
  
  clearLogMessages: function(){
    this.logmessages = [];
  },
  
  log: function() {
    var message='';
    if(arguments.length > 0) {
      var a0 = arguments[0];
      if(a0 != null && a0 != undefined) {
        message = a0.toString();
      }
    }
    for(var i=1; i<arguments.length; i++) {
      message += ' ' + this.toLogString(arguments[i]);
    }
    this.logmessages.push(message);
    if(this.logmessages.length > 100) {
      this.logmessages.splice(0,1);
    }
    console.log(message);
  },
  
  toLogString: function(v){
    if(v===undefined)return"undefined";
    if(v===null)return"null";
    if($.isArray(v))return 'Array['+v.length+']';
    if(v instanceof Date)return 'Date('+$.datepicker.formatDate('yyyy-mm-dd',v)+')';
    if(typeof(v)=='object'){
      var s='';
      for(var i in v)s+=','+i+'='+this.toLogString(v[i]);
      if(s.length>0)s=s.substring(1);
      return '{'+s+'}';
    }
    return v.toString();
  },
  
  getParam: function(p){
    var u=decodeURIComponent(window.location.search.substring(1)),v=u.split('&');
    for(var i=0;i<v.length;i++){
      var kv=v[i].split('=');
      if(kv[0]==p)return kv[1]===undefined?true:kv[1];
    }
  }
};