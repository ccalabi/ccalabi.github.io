var open = false;

function toggleNav() {
	var sideNav = document.getElementById("sideNav");
	if (!open) {
		var clickOut = document.getElementById("clickOut");
		document.getElementById("MenuBtn").style.color = "#003d60";
		sideNav.style.width = "250px";
		open = true;
		if (clickOut.addEventListener) {
			clickOut.addEventListener("click", closeNav);
		}
		else if (clickOut.attachEvent) {
			clickOut.attachEvent("onclick", closeNav);
		}
	}
	else {
		closeNav();
	}
}

function closeNav() {
	var clickOut = document.getElementById("clickOut");
	document.getElementById("MenuBtn").style.color = "white";
	document.getElementById("sideNav").style.width = "0px";
	open = false;
	if (clickOut.removeEventListener) {
		clickOut.removeEventListener("click", closeNav);
	}
	else if (clickOut.detachEvent) {
		clickOut.detachEvent("onclick", closeNav);
	}
}