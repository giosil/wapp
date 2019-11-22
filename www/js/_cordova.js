/* Cordova fittizio per navigazione tramite web */
function OneSignal(){}
OneSignal.prototype.startInit=function(s){
  console.log("OneSignal.startInit");
  return this;
}
OneSignal.prototype.handleNotificationReceived=function(s){
  console.log("OneSignal.handleNotificationReceived");
  if(typeof s=='function') s();
  return this;
}
OneSignal.prototype.handleNotificationOpened=function(s){
  console.log("OneSignal.handleNotificationOpened");
  if(typeof s=='function') s();
  return this;
}
OneSignal.prototype.endInit=function(s){
  console.log("OneSignal.endInit");
  return this;
}
OneSignal.prototype.getPermissionSubscriptionState=function(s){
  console.log("OneSignal.getPermissionSubscriptionState");
  return this;
}
var cordova = {
  addConstructor: function(f) {
    console.log('cordova.addConstructor');
    if(f instanceof Function){
      try {f();}catch(err) {console.log(err);}
    }
  },
  exec: function(){
    var sargs = '';
    for(var i=1; i<arguments.length; i++){
      sargs += ','+this.toLogString(arguments[i]);
    }
    if(sargs.length>0) sargs=sargs.substring(1);
    console.log("cordova.exec(" + sargs + ")");
    if(arguments.length > 4){
      if(arguments[2]=='Toast' && arguments[3]=='show'){
        if(!$('.toastmsg').length){console.log(".toastmsg not found");return;}
        var opts=arguments[4];
        if(!$.isArray(opts))return;
        if(opts.length==0)return;
        var item0=opts[0];
        if(!$.isPlainObject(item0))return;
        if(item0.message){
          $('.toastmsg').text(item0.message);
          $('.toastmsg').fadeIn("fast", function(){setTimeout(function(){$('.toastmsg').fadeOut("slow");},1000);});
        }
      }
    }
  },
  _alert: function(msg){
    if($('.toastmsg').length){
      $('.toastmsg').text(msg);
      $('.toastmsg').fadeIn("fast", function(){setTimeout(function(){$('.toastmsg').fadeOut("slow");},1000);});
    }
  },
  plugins: {
    OneSignal: new OneSignal(),
    diagnostic: {
      isCameraAvailable: function(){console.log("cordova.plugins.diagnostic.isCameraAvailable");},
      requestCameraAuthorization: function(){console.log("cordova.plugins.diagnostic.requestCameraAuthorization");}
    },
    barcodeScanner: {
      scan: function(){console.log("cordova.plugins.barcodeScanner.scan");cordova._alert('Scansione non disponibile da web');}
    }
  },
  toLogString: function(v){
    if(v===undefined)return"undefined";
    if(v===null)return"null";
    if($.isArray(v)){
      var sitems = '';
      for(var i = 0; i < v.length; i++) {
        sitems += ',' + this.toLogString(v[i]);
      }
      if(sitems.length>0) sitems = sitems.substring(1);
      return 'Array['+sitems+']';
    }
    if(v instanceof Date)return 'Date('+$.datepicker.formatDate('yyyy-mm-dd',v)+')';
    if(typeof(v)=='object'){
      var s='';
      for(var i in v)s+=','+i+'='+this.toLogString(v[i]);
      if(s.length>0)s=s.substring(1);
      return '{'+s+'}';
    }
    return v.toString();
  }
};

if(!window.plugins) window.plugins = {};
window.plugins = cordova.plugins;
