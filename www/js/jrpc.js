function JRPC(s){this.urlEndPoint=s;this.authUserName=null;this.authPassword=null;this.callId=0;}
JRPC.prototype.setURL=function(s){
  this.urlEndPoint=s;
}
JRPC.prototype.setUserName=function(s){
  this.authUserName=s;
}
JRPC.prototype.setPassword=function(s){
  this.authPassword=s;
}
JRPC.prototype.upgradeValues=function(obj){
  var m,useHasOwn={}.hasOwnProperty?true:false;
  for(var key in obj){
    if(!useHasOwn || obj.hasOwnProperty(key)){
      if(typeof obj[key]=='string'){
        if(m=obj[key].match(/(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)\.(\d\d\d)./)){
          obj[key]=new Date(0);
          if(m[1])obj[key].setUTCFullYear(parseInt(m[1]));
          if(m[2])obj[key].setUTCMonth(parseInt(m[2])-1);
          if(m[3])obj[key].setUTCDate(parseInt(m[3]));
          if(m[4])obj[key].setUTCHours(parseInt(m[4]));
          if(m[5])obj[key].setUTCMinutes(parseInt(m[5]));
          if(m[6])obj[key].setUTCSeconds(parseInt(m[6]));
          if(m[7])obj[key].setUTCMilliseconds(parseInt(m[7]));
        }
        else if(m=obj[key].match(/^\/Date\((\d+)\)\/$/)){
          obj[key]=new Date(parseInt(m[1]));
        }
      }
      else if(obj[key] instanceof Object){
        this.upgradeValues(obj[key]);
      }
    }
  }
}
JRPC.prototype.beforeExecute=function(m){$.mobile.loading('show');}
JRPC.prototype.afterExecute=function(m){$.mobile.loading('hide');}
JRPC.prototype.execute=function(methodName,params,successHandler,exceptionHandler,dontShowLoading){
  this.callId++;
  if(this.urlEndPoint == 'demo') {
    this.demo(methodName,params,successHandler,exceptionHandler,dontShowLoading);
    return;
  }
  var request,postData;
  request={version:"2.0",method:methodName,id:this.callId};
  if(params)request.params=params;
  postData=JSON.stringify(request);
  var xhr=null;
  if(window.XMLHttpRequest)
    xhr=new XMLHttpRequest();
  else 
  if(window.ActiveXObject){
    try{xhr=new ActiveXObject('Msxml2.XMLHTTP');}catch(err){xhr=new ActiveXObject('Microsoft.XMLHTTP');}
  }
  if(!dontShowLoading) {
    this.beforeExecute(methodName);
  }
  var _this=this;
  xhr.open('POST',this.urlEndPoint,true);
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.setRequestHeader('Accept','application/json');
  if(this.authUserName) {
    xhr.setRequestHeader('Authorization','Basic '+btoa(this.authUserName+":"+this.authPassword));
  }
  xhr.send(postData);
  xhr.onreadystatechange=function(){
    if(xhr.readyState==4){
      if(!dontShowLoading) {
        _this.afterExecute(methodName);
      }
      switch(xhr.status){
        case 200:
          var response=JSON.parse(xhr.responseText);
          if(response.error!==undefined){
            if(typeof exceptionHandler=='function'){
              exceptionHandler(response.error);
            }
          }
          else
          if(typeof successHandler=='function'){
            var result=response.result;
            _this.upgradeValues(result);
            successHandler(result);
          }
          break;
        case 401:
        case 402:
        case 403:
          if(typeof exceptionHandler=='function'){
            error={message:"Accesso non consentito"};
            if(typeof exceptionHandler=='function'){
              exceptionHandler(error);
            }
          }
          break;
        default:
          if(typeof exceptionHandler=='function'){
            if(xhr.status==0){
              error={message:"Trasmissione dati interrotta"};
            }
            else {
              error={message:"Errore di servizio (" + xhr.status + ")"};
            }
            if(typeof exceptionHandler=='function'){
              exceptionHandler(error);
            }
          }
      }
    }
  };
}
JRPC.prototype.demo=function(methodName,params,successHandler,exceptionHandler,dontShowLoading){
  if(typeof successHandler!='function'){
    console.log('successHandler is not a function');
    return;
  }
  if(methodName == 'CRUSCOTTO.getRetailPerformace') {
    successHandler({"series":[[85,71,100,85,50,100,50,85],[64.64524656833838,11.686366114381466,13.945267520828969,7.228207155460812,0.13301845645838156,0.6558001377890994,0.5951477763980424,1.1109462703448318]],"values":[57395.07000000001,10375.7018,12381.26,6417.539999999999,118.10000000000002,582.2499999999999,528.4,986.35],"days":174,"labels":["Retail 1","Retail 2","Retail 3","Retail 4","Retail 5","Retail 6","Retail 7","Retail 8"]});
  }
  else if(methodName == 'CRUSCOTTO.rapportiVendita') {
    successHandler({"fs2":"14/11/2019","fs1":"21/11/2019","is1":"15/11/2019","dgi":0.63301939957745,"is2":"08/11/2019","fm2":"21/10/2019","fm1":"21/11/2019","im1":"22/10/2019","gi1":"21/11/2019","im2":"21/09/2019","gi2":"14/11/2019","peg":"-36,70","vs2":"17.089,61","vs1":"20.860,60","pem":"+4,50","vm2":"81.593,53","vm1":"85.268,06","pet":"-6,74","pes":"+22,07","vg2":"4.207,60","vg1":"2.663,49","ft1":"21/11/2019","dtr":0.9325570436626619,"ft2":"21/08/2019","it2":"21/05/2019","it1":"22/08/2019","vt1":"219.555,24","vt2":"235.433,58","dse":1.2206598618782047,"dme":1.0450345900340292});
  }
  else if(methodName == 'MOBILE.getVendite') {
    successHandler({"series3":[[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,4360.594,4521.32,0.0,2931.588,3567.0736,2421.54,0.0,3702.5212,3690.24,3671.386,3081.916,3571.5132,0.0,0.0,3578.8436,3089.458,0.0,3380.9108,4143.303]],"descs":["2019-10-21 Lu","2019-10-22 Ma","2019-10-23 Me","2019-10-24 Gi","2019-10-25 Ve","2019-10-26 Sa","2019-10-27 Do","2019-10-28 Lu","2019-10-29 Ma","2019-10-30 Me","2019-10-31 Gi","2019-11-01 Ve","2019-11-02 Sa","2019-11-03 Do","2019-11-04 Lu","2019-11-05 Ma","2019-11-06 Me","2019-11-07 Gi","2019-11-08 Ve","2019-11-09 Sa","2019-11-10 Do","2019-11-11 Lu","2019-11-12 Ma","2019-11-13 Me","2019-11-14 Gi","2019-11-15 Ve","2019-11-16 Sa","2019-11-17 Do","2019-11-18 Lu","2019-11-19 Ma","2019-11-20 Me","2019-11-21 Gi"],"series":[[3516.61,2915.8244,3632.166,2757.41,4635.5764,0.0,3559.29,3448.0974,3029.6388,0.0,5143.2756,0.0,3031.12,0.0,2332.36,5158.6076,4103.21,3571.2684,4258.946,0.0,0.0,4578.384,4044.686,0.0,4207.5968,4610.5368,3066.3024,0.0,3314.9104,3589.5064,3615.858,2663.4904]],"series2":[[2981.44,0.0,3537.5942,4069.238,3393.9608,3134.746,5215.0856,0.0,0.0,4997.8716,3666.486,0.0,5230.8776,3915.876,2884.5364,0.0,3622.68,3871.5108,4590.2136,3325.33,3695.18,0.0,0.0,3506.6784,3731.7184,0.0,4734.2336,4521.0436,2432.06,0.0]],"labels2":["Sa21/09","Do22/09","Lu23/09","Ma24/09","Me25/09","Gi26/09","Ve27/09","Sa28/09","Do29/09","Lu30/09","Ma01/10","Me02/10","Gi03/10","Ve04/10","Sa05/10","Do06/10","Lu07/10","Ma08/10","Me09/10","Gi10/10","Ve11/10","Sa12/10","Do13/10","Lu14/10","Ma15/10","Me16/10","Gi17/10","Ve18/10","Sa19/10","Do20/10"],"descs3":["2019-08-21 Me","2019-08-22 Gi","2019-08-23 Ve","2019-08-24 Sa","2019-08-25 Do","2019-08-26 Lu","2019-08-27 Ma","2019-08-28 Me","2019-08-29 Gi","2019-08-30 Ve","2019-08-31 Sa","2019-09-01 Do","2019-09-02 Lu","2019-09-03 Ma","2019-09-04 Me","2019-09-05 Gi","2019-09-06 Ve","2019-09-07 Sa","2019-09-08 Do","2019-09-09 Lu","2019-09-10 Ma","2019-09-11 Me","2019-09-12 Gi","2019-09-13 Ve","2019-09-14 Sa","2019-09-15 Do","2019-09-16 Lu","2019-09-17 Ma","2019-09-18 Me","2019-09-19 Gi","2019-09-20 Ve"],"descs2":["2019-09-21 Sa","2019-09-22 Do","2019-09-23 Lu","2019-09-24 Ma","2019-09-25 Me","2019-09-26 Gi","2019-09-27 Ve","2019-09-28 Sa","2019-09-29 Do","2019-09-30 Lu","2019-10-01 Ma","2019-10-02 Me","2019-10-03 Gi","2019-10-04 Ve","2019-10-05 Sa","2019-10-06 Do","2019-10-07 Lu","2019-10-08 Ma","2019-10-09 Me","2019-10-10 Gi","2019-10-11 Ve","2019-10-12 Sa","2019-10-13 Do","2019-10-14 Lu","2019-10-15 Ma","2019-10-16 Me","2019-10-17 Gi","2019-10-18 Ve","2019-10-19 Sa","2019-10-20 Do"],"labels":["Lu21/10","Ma22/10","Me23/10","Gi24/10","Ve25/10","Sa26/10","Do27/10","Lu28/10","Ma29/10","Me30/10","Gi31/10","Ve01/11","Sa02/11","Do03/11","Lu04/11","Ma05/11","Me06/11","Gi07/11","Ve08/11","Sa09/11","Do10/11","Lu11/11","Ma12/11","Me13/11","Gi14/11","Ve15/11","Sa16/11","Do17/11","Lu18/11","Ma19/11","Me20/11","Gi21/11"],"labels3":["Me21/08","Gi22/08","Ve23/08","Sa24/08","Do25/08","Lu26/08","Ma27/08","Me28/08","Gi29/08","Ve30/08","Sa31/08","Do01/09","Lu02/09","Ma03/09","Me04/09","Gi05/09","Ve06/09","Sa07/09","Do08/09","Lu09/09","Ma10/09","Me11/09","Gi12/09","Ve13/09","Sa14/09","Do15/09","Lu16/09","Ma17/09","Me18/09","Gi19/09","Ve20/09"]});
  }
  else if(methodName == 'MOBILE.getVenditeMensili') {
    successHandler({"descs":["2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11"],"series":[[93730.82,82406.46,91695.5,31275.87,77042.14,86366.31,56146.78],[27950.13,25800.08,28904.26,9877.18,24058.5,27429.96,17943.91]],"series2":[[89467.82,87448.95,93623.3,83538.67,82598.53,74263.56],[27102.35,26437.37,29708.69,27117.01,26365.23,23376.86]],"labels2":["2018-11","2018-12","2019-01","2019-02","2019-03","2019-04"],"descs2":["2018-11","2018-12","2019-01","2019-02","2019-03","2019-04"],"labels":["2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11"]});
  }
  else if(methodName == 'MOBILE.getVenditePerTipo') {
    successHandler({"perc":["37,13","57,05","5,83"],"series":[[32965.16,50647.67,5171.84]],"values":["32.965,16","50.647,67","5.171,84"],"labels":["Tipo 1","Tipo 2","-"]});
  }
  else if(methodName == 'SELLERS.find') {
    successHandler([{"c":"S1","lng":12.603795,"d":"Seller 1","tpc":"S001","i":17,"lat":41.933734},{"c":"S2","lng":12.613571,"d":"Seller 2","tpc":"S002","i":18,"lat":41.935902},{"c":"S3","lng":12.618334,"d":"Seller 3","tpc":"S0010254","i":19,"lat":41.937866}]);
  }
  else if(methodName == 'MOBILE.getSintesiVendite') {
    successHandler([["Numero clienti","105"],["Venduto lordo","2.663,49 &euro;"],["Venduto netto","2.610,88 &euro;"],["Scontrini emessi","92"],["Totale prodotti","251"],["Importo cassa","1.843,39 &euro;"],["Margine","878,88 &euro;"],["Ultima vendita","21/11/2019 19:02:05"]]);
  }
  else if(methodName == 'MOBILE.getGiacenze') {
    successHandler([["PRODOTTO 1",0],["PRODOTTO 2",28],["PRODOTTO 3",29],["PRODOTTO 4",0],["PRODOTTO 5",10],["PRODOTTO 6",7],["PRODOTTO 7",2],["PRODOTTO 8",20],["PRODOTTO 9",0]]);
  }
  else {
    successHandler({});
  }
  window.plugins.toast.show('Demo data loaded', 'short', 'bottom');
}
jrpc=new JRPC("demo");