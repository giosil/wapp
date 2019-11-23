/*jQuery.validator methods*/
jQuery.validator.addMethod("date",function(val,ele){
  var bits=val.match(/([0-9]+)/gi),str;
  if(!bits)return this.optional(ele)||false;
  if(bits[0].length==4){str=bits[0]+'-'+bits[1]+'-'+bits[2];}
  else{str=bits[1]+'/'+bits[0]+'/'+bits[2];}
  return this.optional(ele) || !/Invalid|NaN/.test(new Date(str));
},'Inserire una data valida (gg/mm/aaaa)');
jQuery.validator.addMethod("pwd",function(val,ele){
  if(this.optional(ele))return true;
  if(val.length<8)return false;
  var ll=false,lu=false,nu=false,sy=false;
  for(var i=0;i<val.length;i++){
    var c=val.charCodeAt(i);
    if(c>=97 && c<=122)ll=true;else if(c>=65 && c<=90)lu=true;else
    if(c>=48 && c<=57)nu=true;else sy=true;
  }
  if(!ll||!lu||!nu||!sy)return false;
  return true;
},'Inserire password valida (lung=8, almeno 1 let. min, 1 let. maius., 1 num., 1 simb.)');
jQuery.validator.addMethod("codfis",function(val,ele){
  if(this.optional(ele))return true;
  if(val.length!=16)return false;
  var pattern=/^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/;
  if(val.search(pattern) == -1)return false;
  return true;
},'Inserire codice fiscale valido');
jQuery.validator.addMethod("notEqualTo",function(val,ele,par){
  if(this.optional(ele))return true;
  if(par&&par.indexOf('#')==0)return val!=$(par).val();
  return val!=par;
},'Valore digitato non ammesso');
/*Table sorter*/
function enableTablesorter(t,cfg){
  var table=t;
  if(typeof t=="string")table=$(t);
  if(table===undefined||table===null||table.length==0)return;
  table.unbind('appendCache applyWidgetId applyWidgets sorton update updateCell').removeClass('tablesorter')
    .find('thead th').unbind('click mousedown').removeClass('header headerSortDown headerSortUp');
  if(cfg===undefined||cfg===null){
    table.tablesorter();
  }
  else {
    table.tablesorter(cfg);
  }
}
/*General utils*/
function formatDouble(num){
  if(num===null||num===undefined)return"";
  return (Math.round(parseFloat(num) * 100) / 100).toLocaleString();
}
function formatDate(v){
  if(v===undefined||v===null)return"";
  if(v instanceof Date)return $.datepicker.formatDate('dd/mm/yy',v);
  return v.toString();
}
function normalizeText(t){
  if(t===undefined||t===null)return"";
  t=t.replace("\300","A'").replace("\310","E'").replace("\314","I'").replace("\322","O'").replace("\331","U'");
  t=t.replace("\340","a'").replace("\350","e'").replace("\354","i'").replace("\362","o'").replace("\371","u'");
  t=t.replace("\341","a`").replace("\351","e`").replace("\355","i`").replace("\363","o`").replace("\372","u`");
  t=t.replace("\u20ac","E").replace("\252","a").replace("\260","o");
  return t;
}
function denormalizeText(t){
  if(t===undefined||t===null)return"";
  t=t.replace("A'","\300").replace("E'","\310").replace("I'","\314").replace("O'","\322").replace("U'","\331");
  t=t.replace("a'","\340").replace("e'","\350").replace("i'","\354").replace("o'","\362").replace("u'","\371");
  t=t.replace("a`","\341").replace("e`","\351").replace("i`","\355").replace("o`","\363").replace("u`","\372");
  t=t.replace(" p\362"," po'");
  return t;
}
function setStaticValues(data){
  var p='dd/mm/yy';
  $.each(data,function(k,v){
    var c=$('#'+k);
    if(c===undefined||c===null||!c.length)return;
    if(v===null)v="";
    if(v instanceof Date){c.text($.datepicker.formatDate(p,v));}else if($.isArray(v)){c.text(v);}else{c.text(denormalizeText(v.toString()));}
  });
}
function setFormValues(form,data){
  var p='dd/mm/yy';
  $.each(data,function(k,v){
    var c=$('[name='+k+']',form);
    if(c===undefined||c===null||!c.length)c=$('#'+k,form);
    if(c===undefined||c===null||!c.length)return;
    if(v===null)v="";
    switch(c.attr("type")){
      case "checkbox":case 'radio':c.attr("checked",v);break;
      default:if(v instanceof Date){c.val($.datepicker.formatDate(p,v));}else if($.isArray(v)){c.val(v);}else{c.val(denormalizeText(v.toString()));}
    }
  });
}
function setFormValue(form,k,v){
  var p='dd/mm/yy';
  var c=$('[name='+k+']',form);
  if(c===undefined||c===null||!c.length)c=$('#'+k,form);
  if(c===undefined||c===null||!c.length)return;
  if(v===undefined||v===null)v="";
  switch(c.attr("type")){
    case "checkbox":case 'radio':c.attr("checked",v);break;
    default:if(v instanceof Date){c.val($.datepicker.formatDate(p,v));}else if($.isArray(v)){c.val(v);}else{c.val(denormalizeText(v.toString()));}
  }
}
function getFormValues(form){
  var r={},f=(form instanceof jQuery)?form[0]:form;
  if(f===undefined)return r;
  for(var i=0;i<f.elements.length;i++){
    var e=f.elements[i];
    if(!e.name||!e.value) continue;
    var k=e.name;
    switch(e.type){
      case 'checkbox':r[k]=e.checked;break;
      case 'radio':if(e.checked)r[k]=e.value;break;
      case 'select-one':r[k]=e.options[e.selectedIndex].value;break;
      case 'select-multiple':var a=[];for(var j=0;j<e.length;j++){if(e.options[j].selected)a.push(e.options[j].value);}r[k]=a;break;
      case 'text':case 'textarea':r[k]=normalizeText(e.value);break;
      default:r[k]=e.value;
    }
  }
  return r;
}
function checkCamera(succ){
  app.log('[apputils] checkCamera...');
//  cordova.plugins.diagnostic.isCameraAuthorized({ // ver. 3
//    successCallback: function(available){
//      if(!available){
//        cordova.plugins.diagnostic.requestCameraAuthorization({
//          successCallback: function(status){
//            if(status == cordova.plugins.diagnostic.permissionStatus.GRANTED) console.log('granted');
//          }
//        });
//      }
//    },
//    externalStorage: false
//  });
  cordova.plugins.diagnostic.isCameraAuthorized( // ver. 2
    function(available){
      app.log('[apputils] diagnostic.isCameraAuthorized -> ' + available);
      if(!available){
        app.log('[apputils] diagnostic.requestCameraAuthorization...');
        cordova.plugins.diagnostic.requestCameraAuthorization(
          function(status){
            app.log('[apputils] diagnostic.requestCameraAuthorization -> ' + status);
            if(cordova.plugins.diagnostic.permissionStatus){
              app.log('[apputils] checkCamera callback 1...');
              // dont work fine...
              // if(typeof succ=='function') succ(status == cordova.plugins.diagnostic.permissionStatus.GRANTED);
              // this work...
              if(typeof succ=='function') succ(status != cordova.plugins.diagnostic.permissionStatus.DENIED);
            }
            else {
              app.log('[apputils] checkCamera callback 2...');
              if(typeof succ=='function') succ(false);
            }
          }
        );
      }
      else{
        app.log('[apputils] checkCamera callback 3...');
        if(typeof succ=='function') succ(true);
      }
    }
  );
}
function scanBarCode(c,f){
  app.log('[apputils] scanBarCode...');
  checkCamera(
    function(granted){
      app.log('[apputils] scanBarCode granted=' + granted + '...');
      if(granted){
        var txt=c;
        if(typeof c=="string")txt=$(c);
        if(txt===undefined||txt===null||txt.length==0){
          app.log('[apputils] scanBarCode txt=' + txt + '...');
          return;
        }
        app.log('barcodeScanner.scan...');
        cordova.plugins.barcodeScanner.scan(
          function(result){
            app.log('barcodeScanner.scan -> ' + result.text);
            if(!result.text) return;
            if(result.text.length == 0) return;
            if(result.text.length == 6) {
              result.text = cod39ToCod32(result.text);
            }
            txt.val(result.text);
            if(typeof f=='function') f(result.text);
          },
          function(error){
            app.log('barcodeScanner.scan -> ' + error);
            window.plugins.toast.show("Scansione: " + error);
          }
        );
      }
    }
  );
}
function cod39ToCod32(cod39){
  if(cod39===undefined || cod39===null || cod39=='')return'';
  var j = cod39.length -1;
  var s = 0;
  for (var i = 0; i < cod39.length; i++) {
    var ci='0123456789BCDFGHJKLMNPQRSTUVWXYZ'.indexOf(cod39.charAt(i));
    s += ci*Math.pow(32,j);
    j--;
  }
  var result=s.toString()
  while (result.length < 9)result="0"+result;
  return result;
}
/*AppCache*/
function AppCache(){}
appcache=new AppCache();
AppCache.prototype.buildOptionsSellers=function(c,onChangeCallback){
  var sel=c;
  if(typeof c=="string")sel=$(c);
  if(sel===undefined||sel===null||sel.length==0)return;
  sel.off();
  var opts=sessionStorage.getItem('sellers');
  if(!opts){
    if(sel===undefined||sel===null||sel.length==0)return;
    opts='';
    opts+='<option value="">Selezionare Seller</option>';
    opts+='<option value="1">Seller 1</option>';
    opts+='<option value="2">Seller 2</option>';
    opts+='<option value="3">Seller 3</option>';
    sel.html(opts);
    
    var ss=sessionStorage.getItem('sellers_s');
    if(ss) sel.val(ss);
    sel.selectmenu("refresh", true);
    if(typeof onChangeCallback=='function') {
      sel.on('change', function(e){
        sessionStorage.setItem('sellers_s',$(e.target).val());
        sel.selectmenu("refresh", true);
        onChangeCallback(e);
      });
    }
    sel.trigger("change");
  }
  else {
    sel.html(opts);
    var ss=sessionStorage.getItem('sellers_s');
    if(ss) sel.val(ss);
    sel.selectmenu("refresh", true);
    if(typeof onChangeCallback=='function') {
      sel.on('change', function(e){
        sessionStorage.setItem('sellers_s',$(e.target).val());
        sel.selectmenu("refresh", true);
        onChangeCallback(e);
      });
    }
    sel.trigger("change");
  }
}
AppCache.prototype.buildOptionsProvince=function(c){
  var sel=c;
  if(typeof c=="string")sel=$(c);
  if(sel===undefined||sel===null||sel.length==0)return;
  var o='';
  o+='<option value="">Selezionare provincia</option>';
  o+='<option value="AG">Agrigento</option>';
  o+='<option value="AL">Alessandria</option>';
  o+='<option value="AN">Ancona</option>';
  o+='<option value="AO">Aosta</option>';
  o+='<option value="AR">Arezzo</option>';
  o+='<option value="AP">Ascoli Piceno</option>';
  o+='<option value="AT">Asti</option>';
  o+='<option value="AV">Avellino</option>';
  o+='<option value="BA">Bari</option>';
  o+='<option value="BT">Barletta-Andria-Trani</option>';
  o+='<option value="BL">Belluno</option>';
  o+='<option value="BN">Benevento</option>';
  o+='<option value="BG">Bergamo</option>';
  o+='<option value="BI">Biella</option>';
  o+='<option value="BO">Bologna</option>';
  o+='<option value="BZ">Bolzano</option>';
  o+='<option value="BS">Brescia</option>';
  o+='<option value="BR">Brindisi</option>';
  o+='<option value="CA">Cagliari</option>';
  o+='<option value="CL">Caltanissetta</option>';
  o+='<option value="CB">Campobasso</option>';
  o+='<option value="CI">Carbonia-Jglesias</option>';
  o+='<option value="CE">Caserta</option>';
  o+='<option value="CT">Catania</option>';
  o+='<option value="CZ">Catanzaro</option>';
  o+='<option value="CH">Chieti</option>';
  o+='<option value="CO">Como</option>';
  o+='<option value="CS">Cosenza</option>';
  o+='<option value="CR">Cremona</option>';
  o+='<option value="KR">Crotone</option>';
  o+='<option value="CN">Cuneo</option>';
  o+='<option value="EN">Enna</option>';
  o+='<option value="FM">Fermo</option>';
  o+='<option value="FE">Ferrara</option>';
  o+='<option value="FI">Firenze</option>';
  o+='<option value="FG">Foggia</option>';
  o+='<option value="FC">Forli\'-Cesena</option>';
  o+='<option value="FR">Frosinone</option>';
  o+='<option value="GE">Genova</option>';
  o+='<option value="GO">Gorizia</option>';
  o+='<option value="GR">Grosseto</option>';
  o+='<option value="IM">Imperia</option>';
  o+='<option value="IS">Isernia</option>';
  o+='<option value="SP">La Spezia</option>';
  o+='<option value="AQ">L\'Aquila</option>';
  o+='<option value="LT">Latina</option>';
  o+='<option value="LE">Lecce</option>';
  o+='<option value="LC">Lecco</option>';
  o+='<option value="LI">Livorno</option>';
  o+='<option value="LO">Lodi</option>';
  o+='<option value="LU">Lucca</option>';
  o+='<option value="MC">Macerata</option>';
  o+='<option value="MN">Mantova</option>';
  o+='<option value="MS">Massa Carrara</option>';
  o+='<option value="MT">Matera</option>';
  o+='<option value="ME">Messina</option>';
  o+='<option value="MI">Milano</option>';
  o+='<option value="MO">Modena</option>';
  o+='<option value="MB">Monza e della Brianza</option>';
  o+='<option value="NA">Napoli</option>';
  o+='<option value="NO">Novara</option>';
  o+='<option value="NU">Nuoro</option>';
  o+='<option value="OG">Ogliastra</option>';
  o+='<option value="OT">Olbia-Tempio</option>';
  o+='<option value="OR">Oristano</option>';
  o+='<option value="PD">Padova</option>';
  o+='<option value="PA">Palermo</option>';
  o+='<option value="PR">Parma</option>';
  o+='<option value="PV">Pavia</option>';
  o+='<option value="PG">Perugia</option>';
  o+='<option value="PU">Pesaro-Urbino</option>';
  o+='<option value="PE">Pescara</option>';
  o+='<option value="PC">Piacenza</option>';
  o+='<option value="PI">Pisa</option>';
  o+='<option value="PT">Pistoia</option>';
  o+='<option value="PN">Pordenone</option>';
  o+='<option value="PZ">Potenza</option>';
  o+='<option value="PO">Prato</option>';
  o+='<option value="RG">Ragusa</option>';
  o+='<option value="RA">Ravenna</option>';
  o+='<option value="RC">Reggio di Calabria</option>';
  o+='<option value="RE">Reggio Emilia</option>';
  o+='<option value="RI">Rieti</option>';
  o+='<option value="RN">Rimini</option>';
  o+='<option value="RM">Roma</option>';
  o+='<option value="RO">Rovigo</option>';
  o+='<option value="SA">Salerno</option>';
  o+='<option value="SS">Sassari</option>';
  o+='<option value="SV">Savona</option>';
  o+='<option value="SI">Siena</option>';
  o+='<option value="SR">Siracusa</option>';
  o+='<option value="SO">Sondrio</option>';
  o+='<option value="TA">Taranto</option>';
  o+='<option value="TE">Teramo</option>';
  o+='<option value="TR">Terni</option>';
  o+='<option value="TO">Torino</option>';
  o+='<option value="TP">Trapani</option>';
  o+='<option value="TN">Trento</option>';
  o+='<option value="TV">Treviso</option>';
  o+='<option value="TS">Trieste</option>';
  o+='<option value="UD">Udine</option>';
  o+='<option value="VA">Varese</option>';
  o+='<option value="VE">Venezia</option>';
  o+='<option value="VB">Verbano-Cusio-Ossola</option>';
  o+='<option value="VC">Vercelli</option>';
  o+='<option value="VR">Verona</option>';
  o+='<option value="VV">Vibo Valentia</option>';
  o+='<option value="VI">Vicenza</option>';
  o+='<option value="VS">Villacidro-S.Sperate</option>';
  o+='<option value="VT">Viterbo</option>';
  sel.html(o);
  sel.trigger("change");
}
AppCache.prototype.buildAutocompleteDitte=function(c){
  var txt=c;
  if(typeof c=="string")txt=$(c);
  if(txt===undefined||txt===null||txt.length==0)return;
  txt.autocomplete({
    source: function(request,response){
      jrpc.execute("PRODOTTI.lookupDitta",[request.term],function(r){
        response(r);
      },app.onRpcError);
    },
    minLength: 3
  });
}