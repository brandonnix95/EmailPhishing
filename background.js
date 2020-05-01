var regex = /[^a-zA-Z0-9"]+(irs|urgent|suspended|suspicious|expire|expired|expiring|inactive|inactivity|activate|reactivate)+[^a-zA-Z0-9"]/g;

var linkRegex = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.message = "text") {
    	chrome.storage.local.clear();
    	console.log(request.data);
    	parseDomForPhishyKeywords(request.data);
    	var selWithoutLinks = checkLinks(request.data);
    	checkForTypos(selWithoutLinks);
    }
});

function parseDomForPhishyKeywords(highlightedText) {
	highlightedText.toLowerCase();
	highlightedText = highlightedText.replace(/\./g, " ");

	var matches = highlightedText.match(regex);
	if(matches == null) {
		matches = [];
	}
	if(matches != null) {
		console.log(matches.toString());
		console.log(matches.length);
		chrome.storage.local.set({"phishyKeywords":matches.toString()});
		chrome.storage.local.set({"numPhishyKeywords":matches.length});
	} else {
		console.log("NO MATCHES");
		console.log(0);
		chrome.storage.local.set({"phishyKeywords":matches.toString()});
		chrome.storage.local.set({"numPhishyKeywords":0});
	}
	
}

function checkForTypos(highlightedText) {
	try {
		highlightedText = highlightedText.replace(/\(/g, " ");
		highlightedText = highlightedText.replace(/\)/g, " ");
		highlightedText = highlightedText.replace(/\//g, " ");
		highlightedText = highlightedText.replace(/\:/g, " ");
		highlightedText = highlightedText.replace(/\</g, " ");
		highlightedText = highlightedText.replace(/\>/g, " ");
		highlightedText = highlightedText.replace(/ /g, "%20");
		highlightedText = highlightedText.replace(/\n/g, "%20");
	} catch (e) {
		console.log(e);
	}
 	
	console.log(highlightedText);

	fetch("https://montanaflynn-spellcheck.p.rapidapi.com/check/?text=" + highlightedText, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "montanaflynn-spellcheck.p.rapidapi.com",
				"x-rapidapi-key": "1d0cea98damsh55645334b66fae8p19ccc4jsn579c203b5eb8"
			}
	})
	.then(response => {
		response.json().then(data => {
			try {
				console.log(data.corrections);
				console.log(Object.keys(data.corrections).length + " typos");
				chrome.storage.local.set({"typos":Object.keys(data.corrections)});
				chrome.storage.local.set({"numTypos":Object.keys(data.corrections).length});
			} catch(e) {
				chrome.storage.local.set({"typos":""});
				chrome.storage.local.set({"numTypos":0});
				console.log(e);
			}
		});


	})
	.catch(err => {
		console.log(err);
	});
}

function checkLinks(highlightedText) {
	highlightedText.toLowerCase();

	var matches = highlightedText.match(linkRegex);
	if(matches != null) {
		console.log(matches.toString());
		console.log("NUMBER OF LINKS: " + matches.length);


		/*	Use api to retrieve matches[0], matches[1], etc. reputation	*/
		
		const url =  "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyAZv33kd3PdNo2FAOrstYahKUNBaJ6rksE"
		for (index = 0; index < matches.length; index++) {
		console.log(matches[index]);
	    var msg =   {
        "client": {
        "clientId":      "Brandon And Siraaj Project",
        "clientVersion": "1.5.2"
        },
        "threatInfo": {
        "threatTypes":      ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION", "THREAT_TYPE_UNSPECIFIED"],
        "platformTypes":    ["ANY_PLATFORM"],
        "threatEntryTypes": ["URL", "EXECUTABLE", "THREAT_ENTRY_TYPE_UNSPECIFIED"],
        "threatEntries": [
        {"url": matches[index]}
      ]
    }
  } 
       fetch(url, {
	   "method": "POST",
	   "headers": {
				"Content-Type": "application/json"
			},
	   "body": JSON.stringify(msg)
    })
   .then(response => {
	   response.json().then(data => {
		   try {
			   if (isEmpty(response)) {
				   console.log("NOTHING HERE");
				   reputationScore = "reputation" + index;
				   chrome.storage.local.set({reputationScore:"Safe"});
			   } else {
				   console.log(response.data);
				   console.log("BAD GUY ALERT");
				   reputationScore = "reputation" + index
				   chrome.storage.local.set({reputationScore:"Dangerous"});
			   }
		   } catch(e) {
			   reputationScore = "reputation" + index;
			   chrome.storage.local.set({reputationScore:"Error"});
			   console.log(e);
		   }
	   });
   })
		}


		//chrome.storage.local.set({"numPhishyKeywords":matches.length});
		for(i = 0; i < matches.length; i++) {
			highlightedText = highlightedText.replace(matches[i], " ");
		}
	} else {
		console.log("NO LINKS FOUND");
		console.log(0);
		//chrome.storage.local.set({"numPhishyKeywords":0});
	}
	return highlightedText;

}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}