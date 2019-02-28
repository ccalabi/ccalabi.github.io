//Author: Clement Leung

var sec = 0;
var timesRun = 0;
var  time = 0;
var left = 0;
var right = 0;

function pad ( val ) { return val > 9 ? val : "0" + val; }

function timeStart(){
	time = setInterval( function(){
	   if (timesRun === 60){clearInterval(time); console.log("timesRun is 60");}
       document.getElementById("seconds").innerHTML=pad(++sec%60);
       document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));	   
    }, 1000);
}

function timeStop(){
	if (document.getElementById("winLose").style.display === "block" ){
		console.log(document.getElementById("winLose").style.display);
		console.log("timeStop was called");
	    timesRun = 60;
        left = document.getElementById("seconds").innerHTML=pad(++sec%60);
	    right = document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
	    console.log(right+":"+left);
	    document.getElementById("seconds").style.display = "none";
	    document.getElementById("minutes").style.display = "none";
		var timeFinal = right+":"+left;
		console.log(timeFinal);
		return timeFinal;
	}	
}

function getTime(){
	left = document.getElementById("seconds").innerHTML=pad(++sec%60);
	right = document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
	var timeRet = right+":"+left;
	console.log(timeRet);
	return timeRet;
}

function getMin(){
	var min = document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
	return min;
}

function getSec(){
	var sec = document.getElementById("seconds").innerHTML
	return sec;
}
