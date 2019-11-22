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
JRPC.prototype.test=function(methodName,params,successHandler,exceptionHandler,dontShowLoading){
	if(typeof successHandler=='function'){
		successHandler(params[0]);
	}
}
jrpc=new JRPC("http://localhost:8080/test/rpcm");