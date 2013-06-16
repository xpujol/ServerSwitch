// Author: Peter Williamson
// Company: Carmen Data Ltd
// Date: 15/05/2012

var GLOBAL_currentServers = [];

// return true/false is localStorage has server object
function serversFound() {
	if(typeof(localStorage.ServerSwitch) == 'undefined') {
		return false;
	} else {
		return true;
	}	
}

// update status message
function updateStatus(msg) {
	document.getElementById('status').innerHTML = msg;
}

// load the GLOBAL list from the localStorage
function loadServers() {
	if (serversFound()) {
		GLOBAL_currentServers = JSON.parse(localStorage.ServerSwitch);

		if (GLOBAL_currentServers.length != 0) {
			updateStatus('Servers loaded');
			return;		
		}
	}
	
	updateStatus('No servers');
}

// save the GLOBAL list to the localStorage
function saveServers() {
	updateStatus('Servers saved');
	localStorage.ServerSwitch = JSON.stringify(GLOBAL_currentServers);
	displayServers();
}

// add a new server string to the list
function addServer() {
	var newServer = document.getElementById('txt_addServer').value;

	if(GLOBAL_currentServers.indexOf(newServer) == -1) {
		GLOBAL_currentServers.push(newServer);
		saveServers();
	} else {
		updateStatus('That server already exists');	
	}

	return false;
}

// add the current server in the url
function addCurrentServer() {
	/*
	* TODO 
	* Need to grab current server URL, add to txt field and call addServer()
	*/
}

// if enter key is pressed, call add server
function addServerOnEnter(event) {
	// if key pressed is enter (keycode:13)
	if(event.keyCode == 13) {
		addServer();
	}
}

// delete all occourances of server from list
function delServer(event) {
	var thisServer = event.target.title;

	var cntServers = GLOBAL_currentServers.length;
	
	for(var s = 0; s < cntServers; s++) {
		var checkServer = GLOBAL_currentServers[s];
		if (checkServer == thisServer) {
			GLOBAL_currentServers.splice(s, 1);
			break;
		}
	}
	
	saveServers();
	
}

// switch server, keep path and query
function changeServer(event) {
	var thisServer = event.target.innerHTML;

	// open new tab
	chrome.windows.getCurrent({'populate' : true},function(window){
		var tabs = window.tabs;
		
		var cntTabs = tabs.length;
		
		for(var t = 0; t < cntTabs; t++) {
			var thisTab = tabs[t];
			
			if(thisTab.active) {
				updateTab(thisServer,thisTab);
				break;
			};
		}
	});
}

// move server up/down in list
function moveServer(event) {
	var thisDirection = event.target.className;
	var thisServer = event.target.title;

	var cntServers = GLOBAL_currentServers.length;

	for(var s = 0; s < cntServers; s++) {
		var checkServer = GLOBAL_currentServers[s];
		if (checkServer == thisServer) {
			// swap servers
			if(thisDirection.search(/down/gi) == -1) {
				GLOBAL_currentServers[s] = GLOBAL_currentServers[s-1];
				GLOBAL_currentServers[s-1] = thisServer;
			} else {
				GLOBAL_currentServers[s] = GLOBAL_currentServers[s+1];
				GLOBAL_currentServers[s+1] = thisServer;
			}
			break;
		}
	}

	saveServers();
}

// change tab to new url
function updateTab(server,tab) {
	var url = tab.url;
	
	var q = '';
	var p = '';
	var s = '';
	var d = '';
	
	url = url.replace(/https?:\/\//gi,'');
	
	// break off query string
	tmp = url.search(/\?|$/);
	q = url.substr(tmp);
	url = url.substr(0,tmp);
	
	// break off path
	tmp =  url.search(/\/|$/);
	p = url.substr(tmp);
	url = url.substr(0,tmp);
	
	// break remainded of URL into subdomain and domain
	tmp = url.search(/\./)+1;
	s = url.substr(0,tmp);
	d = url.substr(tmp);	
	
	//url = 'http://'+s+server+p+q;
	url = 'http://'+server+p+q;
	chrome.tabs.create({'url' : url});
	
}

// list the servers in the plugin
function displayServers() {
	var cntServers = GLOBAL_currentServers.length;
	var serverList = document.getElementById('serverList');
	
	// empty current list
	serverList.innerHTML = '';
	
	for(var s = 0; s < cntServers; s++) {
		var thisServer = GLOBAL_currentServers[s];
		var newDiv = document.createElement('div');
		newDiv.setAttribute('class','server');
		
		var newTitle = document.createElement('span');
		newTitle.setAttribute('class','title')
		newTitle.addEventListener("click", changeServer);
		newTitle.textContent = thisServer;		

		var newDelete = document.createElement('span');
		newDelete.setAttribute('class','delete btn')
		newDelete.setAttribute('title',thisServer);		
		newDelete.addEventListener("click", delServer);
		newDelete.textContent = 'Delete';

		newDiv.appendChild(newTitle);

		// move up button - not to element 0
		if(s != 0) {
			var moveUp = document.createElement('span');
			moveUp.setAttribute('class','move up btn');
			moveUp.setAttribute('title',thisServer);		
			moveUp.addEventListener("click", moveServer);
			moveUp.textContent = 'Up';
			newDiv.appendChild(moveUp);
		}

		// move down button - not to element [cntServers-1]
		if(s < cntServers-1) {
			var moveDown = document.createElement('span');
			moveDown.setAttribute('class','move down btn');
			moveDown.setAttribute('title',thisServer);		
			moveDown.addEventListener("click", moveServer);
			moveDown.textContent = 'Down';
			newDiv.appendChild(moveDown);
		}
		
		newDiv.appendChild(newDelete);

		serverList.appendChild(newDiv);
	}
}

// on load functions
window.onload = function() {
	loadServers();
	displayServers();
		
	// add listener to add buttons
	var btn = document.getElementById("btn_addServer");
	btn.addEventListener("click", addServer);

	var btn = document.getElementById("btn_currentServer");
	btn.addEventListener("click", addCurrentServer);

	var input = document.getElementById("txt_addServer");
	input.addEventListener("keyup", addServerOnEnter);
}
