chrome.storage.local.get("phishyKeywords", function(data){
	if(data.phishyKeywords.length > 0) {
		document.getElementById("tooltipTextKeywords").innerHTML = data.phishyKeywords;	
	} else {
		document.getElementById("tooltipTextKeywords").innerHTML = "no keywords found";
	}
});


chrome.storage.local.get("numPhishyKeywords", function(data){
	var barPercent = 0;
	document.getElementById("numKeywords").innerHTML = data.numPhishyKeywords;
	if(data.numPhishyKeywords == 0) {
		document.getElementById("innerBarKeywords").style.width = "0%";
		document.getElementById("numKeywords").style.color = "green";
	} else {
		barPercent = data.numPhishyKeywords / 10;
		if(barPercent < 1) {
			barPercent *= 100;
		} else {
			barPercent = 100;
		}	
		document.getElementById("innerBarKeywords").style.width = barPercent.toString() + "%";

		if(barPercent <= 30) {
			document.getElementById("numKeywords").style.color = "green";
			document.getElementById("innerBarKeywords").style.backgroundColor = "green";
		} else if (barPercent > 30 && barPercent <= 70) {
			document.getElementById("numKeywords").style.color = "orange";
			document.getElementById("innerBarKeywords").style.backgroundColor = "orange";
		} else {
			document.getElementById("numKeywords").style.color = "red";
			document.getElementById("innerBarKeywords").style.backgroundColor = "red";
		}
	}

});

chrome.storage.local.get("typos", function(data){
	if(data.typos != "") {
		var typos;
		try {
			typos = data.typos.toString();
			typos = typos.replace(/\,/g, ", ");
		} catch(e) {
			typos = "no typos found";
		}
		document.getElementById("tooltipTextTypos").innerHTML = typos;	
	} else {
		document.getElementById("tooltipTextTypos").innerHTML = "no typos found";
	}
});


chrome.storage.local.get("numTypos", function(data) {
	var barPercent = 0;
	document.getElementById("numTypos").innerHTML = data.numTypos;
	if(data.numTypos == 0) {
		document.getElementById("innerBarTypos").style.width = "0%";
		document.getElementById("numTypos").style.color = "green";
	} else {
		barPercent = data.numTypos / 10;
		if(barPercent < 1) {
			barPercent *= 100;
		} else {
			barPercent = 100;
		}	
		document.getElementById("innerBarTypos").style.width = barPercent.toString() + "%";

		if(barPercent <= 30) {
			document.getElementById("numTypos").style.color = "green";
			document.getElementById("innerBarTypos").style.backgroundColor = "green";
		} else if (barPercent > 30 && barPercent <= 70) {
			document.getElementById("numTypos").style.color = "orange";
			document.getElementById("innerBarTypos").style.backgroundColor = "orange";
		} else {
			document.getElementById("numTypos").style.color = "red";
			document.getElementById("innerBarTypos").style.backgroundColor = "red";
		}
	}
});