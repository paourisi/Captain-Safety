Components.utils.import("chrome://captainsafetydetection/content/mymodule.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

var label="Disable";
var file;
var currentUrl=null;
var package=null;


function Link(path,array)
{
	this.path=path;
	this.attributes=array;
}




function parameters(parameter,array)
{
	this.parameter=parameter;
	this.values=array;
}



function myObserver(){}



myObserver.prototype = {
	
  observe: function(subject, topic, data) {

	if("http-on-modify-request"){
		
	  if(CurrentFile.id==myExtension.Id){ 
	   
		var httpChannel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
		
		if((currentUrl==getBrosUrl(httpChannel.originalURI.spec)) && (httpChannel.originalURI.spec.match(/http:\/\/.*\?[a-zA-Z0-9]*=/)==null?false:true)){
	 			
				
                  
				   var http=new Array();
				   var tmp=new Array();
				   tmp.push(httpChannel.originalURI.spec)
				   var position;
				   
				   buildstat(http,tmp,0);

				   for(var k=0;k<package.length;k++){
							  
						if(package[k].path==http[0].path){ 
							 position=k;
							 break;
						}
				   }
			       
				   if(!AbsencePresenceAttributeModel(http,position)){
				             message();
							 subject.cancel(Components.results.NS_BINDING_ABORTED);
							 return;
				   }
				   				   				   
				   if(!AttributeOrder(http,position)){
				             message();
							 subject.cancel(Components.results.NS_BINDING_ABORTED);
							 return;
				   }
				   if(!TypeLearner(http,position)){
				             message();
							 subject.cancel(Components.results.NS_BINDING_ABORTED);
							 return;
				   }
				   if(!AttributeLengthModel(http,position,0))	{
				             message();
							 subject.cancel(Components.results.NS_BINDING_ABORTED);
							 return;
				   }		   				   			
		  }
	   }
	}
	 
	 
  },
  register: function() {
    var observerService = Components.classes["@mozilla.org/observer-service;1"]
                          .getService(Components.interfaces.nsIObserverService);
    observerService.addObserver(this, "http-on-modify-request", false);

  },
  unregister: function() {
    var observerService = Components.classes["@mozilla.org/observer-service;1"]
                            .getService(Components.interfaces.nsIObserverService);
    observerService.removeObserver(this, "http-on-modify-request");
  }
}



function fromkey(e){
    
	if(e.target.getAttribute("id")=="key-enable")
	{   
	    var ob=new Object();
		ob.target=document.getElementById("radio_on");
		action(ob);
	}else if(e.target.getAttribute("id")=="key-disable")
	{
		var ob=new Object();
		ob.target=document.getElementById("radio_off");
		action(ob);
	}
	else
	{
		option();
	}
}



function action(e){
		
	if(e.target.getAttribute("label")!=label && e.target.getAttribute("id")!="button_cs")
	{
	   if(e.target.getAttribute("label")=="Enable"){
		if(document.getElementById("button_cs")){
			document.getElementById("button_cs").style.listStyleImage='url("chrome://captainsafetydetection/skin/captain_america_shield_16x16.png")';
			document.getElementById("button_cs").setAttribute("name","Enable");
			document.getElementById("button_cs").setAttribute("tooltiptext","Captain Safety is online");
		}
		document.getElementById("radio_on").setAttribute("checked","true");
	    document.getElementById("radio_off").removeAttribute("checked");
		document.getElementById("radio_on2").setAttribute("checked","true");
	    document.getElementById("radio_off2").removeAttribute("checked");
		myExtension.Observers.register();
		state.state=1;
		
	   }
	   else{
		if(document.getElementById("button_cs")){
			document.getElementById("button_cs").style.listStyleImage='url("chrome://captainsafetydetection/skin/captain_america_shield_16x16_black.png")';
			document.getElementById("button_cs").setAttribute("name","Disable");
			document.getElementById("button_cs").setAttribute("tooltiptext","Captain Safety is offline");
		}
		document.getElementById("radio_off").setAttribute("checked","true");
		document.getElementById("radio_on").removeAttribute("checked");
		document.getElementById("radio_off2").setAttribute("checked","true");
		document.getElementById("radio_on2").removeAttribute("checked");
		myExtension.Observers.unregister();
		state.state=0;
	   }
	
	   label=e.target.label;
    }
	else if(e.target.getAttribute("id")=="button_cs")
	{
		
		if(e.target.getAttribute("name")=="Disable"){
		   e.target.style.listStyleImage='url("chrome://captainsafetydetection/skin/captain_america_shield_16x16.png")';
		   label="Enable";
		   e.target.setAttribute("name","Enable");
		   e.target.setAttribute("tooltiptext","Captain Safety is online");
		   document.getElementById("radio_on").setAttribute("checked","true");
		   document.getElementById("radio_off").removeAttribute("checked");
		   document.getElementById("radio_on2").setAttribute("checked","true");
		   document.getElementById("radio_off2").removeAttribute("checked");
		   myExtension.Observers.register();
		   state.state=1;
		}else
		{
		   e.target.style.listStyleImage='url("chrome://captainsafetydetection/skin/captain_america_shield_16x16_black.png")';
		   label="Disable";
		   e.target.setAttribute("name","Disable");
		   e.target.setAttribute("tooltiptext","Captain Safety is offline");
		   document.getElementById("radio_off").setAttribute("checked","true");
		   document.getElementById("radio_on").removeAttribute("checked");
		   document.getElementById("radio_off2").setAttribute("checked","true");
		   document.getElementById("radio_on2").removeAttribute("checked");
		   myExtension.Observers.unregister();
		   state.state=0;   
		}		
	}
}



function option(){window.open("chrome://captainsafetydetection/content/options.xul", "bmarks", "chrome,centerscreen,width=600,height=300");}



function installButton()
{ 
    var id = "button_cs";
	var toolbarId = "nav-bar";
 
	var toolbar = document.getElementById(toolbarId);
 
	//add the button at the end of the navigation toolbar	
	toolbar.insertItem(id, toolbar.lastChild);
	toolbar.setAttribute("currentset", toolbar.currentSet);
	document.persist(toolbar.id, "currentset");
 
	//if the navigation toolbar is hidden, 
	//show it, so the user can see your button
	toolbar.collapsed = false;
}



function firstRun(extensions) {
	
    var extension = extensions.get("captainsafetydetection@paouris.com");
    
    if (extension.firstRun) {
        installButton();
    }
}




var myExtension={
	
	Observers:null,
	prefs:null,
	clock:null,
	prevwidth:null,
	Id:null,
	
	init:function(){
		
		if (Application.extensions)
           firstRun(Application.extensions);
        else
           Application.getExtensions(firstRun);
		  
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService).getBranch("accessibility.");
			
		this.Observers = new myObserver();
		
				
	    try{	
	      this.prevwidth=parseInt(this.prefs.getIntPref("window_innerwidth"));
          this.prefs.setIntPref("window_innerwidth",window.innerWidth);	
		}catch(e){
		  this.prefs.setIntPref("window_innerwidth",window.innerWidth);	
		}

		setInterval(function(){
		if(state.state==1){
			var ob=new Object();
		    ob.target=document.getElementById("radio_on");
		    action(ob);
		}else{
			var ob=new Object();
		    ob.target=document.getElementById("radio_off");
	     	action(ob);
		}},500);
		
		this.Id=numBros.num;
		numBros.num+=numBros.num+1;
	}
};



  
function clock()
{
	    try{			  
	
		  if(parseInt(myExtension.prefs.getIntPref("malicious"+myExtension.Id))>0){
			  
			 var tmp=parseInt(myExtension.prefs.getIntPref("malicious"+myExtension.Id));		    
			 var message = "Captain Safety has blocked "+tmp>1?tmp+" pop-ups":"Captain Safety has blocked "+tmp+" pop-up";
			 var nb = gBrowser.getNotificationBox();
			 var n = nb.getNotificationWithValue('popup-blocked');
			 if(n) {
				n.label = message;
			 } else {
				var buttons = [{
					label: 'Button',
					accessKey: 'B',
					popup: 'blockedPopupOptions',
					callback: null
				}];
			
				const priority = nb.PRIORITY_WARNING_MEDIUM;
				nb.appendNotification(message, 'popup-blocked',
									 "chrome://captainsafetydetection/skin/captain_america_shield_16x16.png",
									  priority, {});}
									  
			  myExtension.prefs.setIntPref("malicious"+myExtension.Id,0);
		 }	  
	 }catch(e){
	 } 
}



 myExtension.init();
 
 window.addEventListener('load',popup,false);
 window.addEventListener("click",ClickEvent,false);
 window.addEventListener("mouseover",ClickEvent,false);
 


function popup(win){
	 
   if(myExtension.prevwidth!=null && window.innerWidth!=myExtension.prevwidth && state.state==1){
	   
	    try{	
	      myExtension.prefs.setIntPref(CurrentFile.File,parseInt(myExtension.prefs.getIntPref(CurrentFile.File))+1);
		}catch(e){
		  myExtension.prefs.setIntPref(CurrentFile.File,1);
		}
		
		myExtension.prefs.setIntPref("window_innerwidth",myExtension.prevwidth);	
		
	    window.clearInterval(myExtension.clock);		  
	    window.close();
		
   }else if(myExtension.prevwidth!=null && window.innerWidth!=myExtension.prevwidth){
	   
	    myExtension.prefs.setIntPref("window_innerwidth",myExtension.prevwidth);
		
   }else{
	   
	    myExtension.clock=setInterval(function(){clock()},1000);
		
		try{
			
		 var path=myExtension.prefs.getCharPref("training");
		 var file = new FileUtils.File(path);
		 var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].
              createInstance(Components.interfaces.nsIFileInputStream);
		  istream.init(file, 0x01, 0444, 0);
		  istream.QueryInterface(Components.interfaces.nsILineInputStream);
		
		  // read lines into array
		  var line = {}, lines = [], hasmore;
		  do {
			hasmore = istream.readLine(line);
			lines.push(line.value); 
		  }while(hasmore);
		
		  istream.close();

		  buildKnowledge(lines);
		  
		}catch(e){alert(e);}
		
		try{
			  if(myExtension.prefs.getCharPref("levels")=="normal"){
				  
					document.getElementById("level_normal").setAttribute("checked","true");
					document.getElementById("level_medium").removeAttribute("checked");
					document.getElementById("level_strong").removeAttribute("checked");
					document.getElementById("level_normal2").setAttribute("checked","true");
					document.getElementById("level_medium2").removeAttribute("checked");
					document.getElementById("level_strong2").removeAttribute("checked");
					
			  }else if(myExtension.prefs.getCharPref("levels")=="medium"){
				  
					document.getElementById("level_medium").setAttribute("checked","true");
					document.getElementById("level_normal").removeAttribute("checked");
					document.getElementById("level_strong").removeAttribute("checked");
					document.getElementById("level_medium2").setAttribute("checked","true");
					document.getElementById("level_normal2").removeAttribute("checked");
					document.getElementById("level_strong2").removeAttribute("checked");
					
			  }else{
					document.getElementById("level_strong").setAttribute("checked","true");
					document.getElementById("level_normal").removeAttribute("checked");
					document.getElementById("level_medium").removeAttribute("checked");
					document.getElementById("level_strong2").setAttribute("checked","true");
					document.getElementById("level_normal2").removeAttribute("checked");
					document.getElementById("level_medium2").removeAttribute("checked");
			  }
			    
		  }
		  
		catch(e){}
   }
}



function ClickEvent(){
	
	CurrentFile.File="malicious"+myExtension.Id;
	CurrentFile.id=myExtension.Id;
}



function writeHttp(url){
	

	        var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
               createInstance(Components.interfaces.nsIFileOutputStream);

			// use 0x02 | 0x10 to open file for appending.
			foStream.init(file, 0x02 | 0x10 | 0x08, 0666, 0); 
			// write, create, truncate
			// In a c file operation, we have no need to set file mode with or operation,
			// directly using "r" or "w" usually.
			
			// if you are sure there will never ever be any non-ascii text in data you can 
			// also call foStream.write(data, data.length) directly
			var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
							createInstance(Components.interfaces.nsIConverterOutputStream);

			converter.init(foStream, "UTF-8", 0, 0);
			converter.writeString(url+"\n");
			converter.close(); // this closes foStream
}



function getBrosUrl(url){
	
      if(url.indexOf("https")==-1){
		  
		var string=url
		
		string=string.substring(7).substring(0,string.substring(7,string.length).indexOf("/"));
  
	    var loc=string.substring(string.lastIndexOf(".")+1,string.length);
	  
	    string=string.substring(0,string.lastIndexOf("."));
	  
	    var domain=string.substring(string.lastIndexOf(".")+1,string.length);
		
		var tmp=domain+"."+loc;		
				
        return tmp;	
	 
	 }else
        return null;
}

function training(e){

	
    const nsIFilePicker = Components.interfaces.nsIFilePicker;

	var fp = Components.classes["@mozilla.org/filepicker;1"]
				   .createInstance(nsIFilePicker);
	fp.init(window, "Choose a File", nsIFilePicker.modeOpen);
	fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);
	
	var rv = fp.show();
	if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
		
	 try{
		 
	  var file = fp.file;
	  // Get the path as string. Note that you usually won't 
	  // need to work with the string paths.
	  var path = fp.file.path;
	  // work with returned nsILocalFile...
	  
	  myExtension.prefs.setCharPref("training",path);
	  
	  var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].
              createInstance(Components.interfaces.nsIFileInputStream);
	  istream.init(file, 0x01, 0444, 0);
	  istream.QueryInterface(Components.interfaces.nsILineInputStream);
	
	  // read lines into array
	  var line = {}, lines = [], hasmore;
	  do {
	    hasmore = istream.readLine(line);
	    lines.push(line.value); 
	  }while(hasmore);
	
	  istream.close();
	
	  buildKnowledge(lines);
	  
	  var message = "Training Completed!";
			 var nb = gBrowser.getNotificationBox();
			 var n = nb.getNotificationWithValue('popup-blocked');
			 if(n) {
				n.label = message;
			 } else {
				var buttons = [{
					label: 'Button',
					accessKey: 'B',
					popup: 'blockedPopupOptions',
					callback: null
				}];
			
				const priority = nb.PRIORITY_WARNING_MEDIUM;
				nb.appendNotification(message, 'popup-blocked',
									 "",
									  priority, {});}		
	  
	}catch(e){}
   }	
			    
								 	
}



function configAtt(string,array){

   	var tmp=string.split("&");
	var previous="";

	for(var i=0;i<tmp.length;i++){
			  
		  var tiny=tmp[i].split("=");

		  var result=CheckParameterExists(array,tiny[0]);
          
		  if(result==null){ 
		  
			  array.push(new parameters(tiny[0],new Array()));
			  array[array.length-1].values.push(tiny[1]);
			  array[array.length-1].front=new Array();
			  array[array.length-1].score=-1;
			  
			  if(!isNaN(parseInt(tiny[1]))){
				  
				   array[array.length-1].type="integer";				  
			  }
			  else{
				  
				  if(tiny[1].indexOf("/")!=-1)
				      array[array.length-1].type="path";
				  else
				      array[array.length-1].type="string";
			  }
			  
			  if(array.length>1){
				  				 
				  for(var j=0;j<array.length;j++)		     
					 if(array[j].parameter==previous)
						array[j].front.push(tiny[0]);
		      }		  				  
			  previous=tiny[0];
			  
		  }else{
			  
			  array[result].values.push(tiny[1]);
			  
			  if(array.length>1){
									 
				  for(var k=0;k<array.length;k++)		     
					 if(array[k].parameter==previous){
						  var check;
						  for(var j=0;j<array[k].front.length;j++){
							   if(array[k].front[j]==tiny[0])
								 check=true;
						  }
						  if(!check)
				             array[k].front.push(tiny[0]);					
					 }
		      }		  				  
			  previous=tiny[0];

		  }

	}
}



function CheckPathExists(paths,path){

	for(i=0;i<paths.length;i++){
		
	     if(paths[i].path==path){
		   return i;	
		 }
	}
	
    return null;	
}




function CheckParameterExists(array,parameter){
	
	for(i=0;i<array.length;i++){

	     if(array[i].parameter==parameter)
		   return i;	
	}

    return null;	
}




function buildstat(paths,array,flag){
   
   for(var i=0;i<array.length;i++){

	   var string=array[i];
	   
       var path=string.substring(0,string.indexOf("?"));

	   var result=CheckPathExists(paths,path);

	   if(result==null){

		   if(path[path.length-1]=="/"){		
		   	  
			  paths.push(new Link(path.substring(0,path.length-1),new Array()));
			  configAtt(string.substring(string.indexOf("?")+1,string.length),paths[paths.length-1].attributes);			 
		   }
		   else{
			  paths.push(new Link(path,new Array()));
			  configAtt(string.substring(string.indexOf("?")+1,string.length),paths[paths.length-1].attributes);	  	
		   }

		      paths[paths.length-1].numberAtt=new Array();
			  var check=false;
			  for(var j=0;j<paths[paths.length-1].numberAtt.length;j++){
			       if(paths[paths.length-1].numberAtt[j]==paths[paths.length-1].attributes.length)
				     check=true;
			  }
			  
			  if(!check)
			   paths[paths.length-1].numberAtt.push(string.substring(string.indexOf("?")+1,string.length).split("&").length);
		   
	   }else{

	          configAtt(string.substring(string.indexOf("?")+1,string.length),paths[result].attributes);
			  var check;
			  for(var j=0;j<paths[result].numberAtt.length;j++){
			       if(paths[result].numberAtt[j]==string.substring(string.indexOf("?")+1,string.length).split("&").length)
				     check=true;
			  }
			  if(!check)
			   paths[result].numberAtt.push(string.substring(string.indexOf("?")+1,string.length).split("&").length);
			 
	   }
   }
   
   if(flag){
	   
	   length=paths.length;

	   for(var i=0;i<length;i++){
		   
		   for(var j=0;j<paths[i].attributes.length;j++){
			  
			  var sum=0;
			  for(var k=0;k<paths[i].attributes[j].values.length;k++){
					   
					   sum+=new String(paths[i].attributes[j].values[k]).length;				   
				 
			  }
			  paths[i].attributes[j].mean=(sum/paths[i].attributes[j].values.length);         
		   }         
	   }
	   
	   for(var i=0;i<length;i++){
		   
		   for(var j=0;j<paths[i].attributes.length;j++){
			  
			  var sum=0;
			  for(var k=0;k<paths[i].attributes[j].values.length;k++){
					   
					   sum+=Math.pow(((new String(paths[i].attributes[j].values[k]).length)- paths[i].attributes[j].mean),2);				   
				 
			  }
			  paths[i].attributes[j].variance=(sum/paths[i].attributes[j].values.length);         
		   }         
	   }
   }	
}



//------------------------------------------------------------------------------------
function AttributeLengthModel(http,position,flag){
 	
   var w=2;
   var score;	
	   
   for(var i=0;i<http.length;i++)	   
	   for(var j=0;j<http[i].attributes.length;j++)
		      for(var k=0;k<package[position].attributes.length;k++){		
			               
					 if(package[position].attributes[k].parameter==http[i].attributes[j].parameter){
						 
						var p=(package[position].attributes[k].variance)/Math.pow((new String(http[i].attributes[j].values[0]).length-package[position].attributes[k].mean),2);
												
						if(isNaN(p))
						  p=1;
						else{
							
						  if(p>1)
						   p=1;
						  else if(p<0)
						   p=0
						}
						  
						  score=w*(1-p);
						
					   if(flag){
						   
							if(score>package[position].attributes[k].score || package[position].attributes[k].score==-1)
							 package[position].attributes[k].score=score;
						 
					   }
					   else{
						   
							var normalscore=package[position].attributes[k].score;   
							var levelscore;
							   
							if(document.getElementById("level_normal").getAttribute("checked")=="true"){
								levelscore=normalscore+(normalscore*95/100);
							}else if(document.getElementById("level_medium").getAttribute("checked")=="true"){
								levelscore=normalscore+(normalscore*60/100);
							}else{
								levelscore=normalscore;
							}
							//alert(package[position].attributes[k].score+" "+package[position].attributes[k].mean+" "+package[position].attributes[k].variance);
							  //alert(score+" "+levelscore); 
							if(score>levelscore)
							 return 0;
						 
					   }
					 }
					 
	          }
		return 1;  
}



//-------------------------------------------------------------------------------------
function AbsencePresenceAttributeModel(http,position){
	
   var counter=0;
   
   for(var k=0;k<package[position].numberAtt.length;k++)
        if(package[position].numberAtt[k]==http[0].numberAtt[0])
		   counter++;
   
   if(!counter)
       return 0;
   
   counter=0;
   
   for(var i=0;i<http.length;i++)
	   for(var j=0;j<http[i].attributes.length;j++)	   
	       for(var k=0;k<package[position].attributes.length;k++){	         
			     			 
				 if(http[i].attributes[j].parameter==package[position].attributes[k].parameter){
				  counter++;
				  break;
				 }
	       }         
			
   if(counter!=http[0].attributes.length)
    return 0;
   else
    return 1;
		
}


//-------------------------------------------------------------------------------------
function TypeLearner(http,position){
	
	for(var i=0;i<http.length;i++)	      
	   for(var j=0;j<http[i].attributes.length;j++)	   
	       for(var k=0;k<package[position].attributes.length;k++){	         
			     
				 if(http[i].attributes[j].parameter==package[position].attributes[k].parameter){
					 					 					 
					 if((http[i].attributes[j].type!=package[position].attributes[k].type))
				     return 0;
				 }
	       }
    
	return 1;   
}



//-------------------------------------------------------------------------------------
function AttributeOrder(http,position){
	
	var counter;

	for(var i=0;i<http.length;i++)	      
	   for(var j=0;j<http[i].attributes.length;j++)	   
	       for(var k=0;k<package[position].attributes.length;k++){	         
			     
				 if(http[i].attributes[j].parameter==package[position].attributes[k].parameter){
                    					
                    counter=0;
					for(var l=0;l<package[position].attributes[k].front.length;l++){
												 
						 if((http[i].attributes[j].front[0]==package[position].attributes[k].front[l])){						
						  counter++;
						  break;
						 }
					}
					
					if(counter==0 && http[i].attributes[j].front.length!=0)
					return 0;

				 }
	       }
		   
     return 1;
}



function message(){
	
             var message = "Captain Safety has blocked some malicious activities!";
			 var nb = gBrowser.getNotificationBox();
			 var n = nb.getNotificationWithValue('popup-blocked');
			 if(n) {
				n.label = message;
			 } else {
				var buttons = [{
					label: 'Button',
					accessKey: 'B',
					popup: 'blockedPopupOptions',
					callback: null
				}];
			
				const priority = nb.PRIORITY_WARNING_MEDIUM;
				nb.appendNotification(message, 'popup-blocked',
									 "chrome://captainsafetydetection/skin/warning.png",
									  priority, {});}		
}



function buildKnowledge(lines){
      
	  currentUrl=getBrosUrl(lines[0]);
	  
      package=new Array();

	  buildstat(package,lines,1);
	  
	  for(var i=0;i<lines.length;i++){
	  
		   var http=new Array();
		   var tmp=new Array();
		   tmp.push(lines[i])
		   var position;
		   
		   buildstat(http,tmp,0);
		   
		   for(var k=0;k<package.length;k++){
					  
				if(package[k].path==http[0].path){ 
					 position=k;
					 break;
				}
		   }
	
		   AttributeLengthModel(http,position,1);
	
	 }	
	
}



function level(e){
	
	      if(e.target.getAttribute("id")=="level_normal"){
			  
				myExtension.prefs.setCharPref("levels","normal");
				document.getElementById("level_normal").setAttribute("checked","true");
				document.getElementById("level_medium").removeAttribute("checked");
				document.getElementById("level_strong").removeAttribute("checked");
				document.getElementById("level_normal2").setAttribute("checked","true");
				document.getElementById("level_medium2").removeAttribute("checked");
				document.getElementById("level_strong2").removeAttribute("checked");
				
		  }else if(e.target.getAttribute("id")=="level_medium"){
			  
				myExtension.prefs.setCharPref("levels","medium");
				document.getElementById("level_medium").setAttribute("checked","true");
				document.getElementById("level_normal").removeAttribute("checked");
				document.getElementById("level_strong").removeAttribute("checked");
				document.getElementById("level_medium2").setAttribute("checked","true");
				document.getElementById("level_normal2").removeAttribute("checked");
				document.getElementById("level_strong2").removeAttribute("checked");

		  }else{
				myExtension.prefs.setCharPref("levels","strong");
				document.getElementById("level_strong").setAttribute("checked","true");
				document.getElementById("level_normal").removeAttribute("checked");
				document.getElementById("level_medium").removeAttribute("checked");
				document.getElementById("level_strong2").setAttribute("checked","true");
				document.getElementById("level_normal2").removeAttribute("checked");
				document.getElementById("level_medium2").removeAttribute("checked");
		  }	
}