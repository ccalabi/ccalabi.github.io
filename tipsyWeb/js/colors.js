//Author: Cyrus Farsoudi

colors = ["Blue", "Orange", "Red", "Green"];
colors_l = ["blue", "orange", "red", "green"];

chosen_color = "blue";
chosen_text = "Green";
oldcol = 0
oldtext = 3

score_ = 0;

function newColor(color){
	var scoreText = "Score: ";
	if (color === chosen_text) {
		out = "Correct!!!"
		score_+=1;
		flag = true
  	} else {
  		flag = false
  		out = "Incorrect.";
	}
	document.getElementById("colorFeeds").innerHTML = out; 
	document.getElementById('colorScore').innerHTML = (scoreText+score_);	
	if (score_ < 10) {
		if (flag === true){
			var rand1 = Math.floor(Math.random() * 4);
			var rand2 = Math.floor(Math.random() * 4);
			while(rand1 === rand2 || oldcol === rand1 || oldtext === rand2){
				var rand1 = Math.floor(Math.random() * 4);
				var rand2 = Math.floor(Math.random() * 4);
			}
			oldcol = rand1;
			oldtext = rand2;
			chosen_text = colors[rand1];
			chosen_color = colors_l[rand2];
			document.getElementById('toTypeIn').innerHTML = chosen_text;
			document.getElementById('toTypeIn').style.color = chosen_color;
		}
	}
	else {
		getTime();
		document.getElementById("colorGame").style.display = "none";
		document.getElementById("mazeGame").style.display = "block";
		maze();
	}
}

// var sec1 = 0;
// function pad ( val ) { return val > 9 ? val : "0" + val; }
  
// var refreshTimer = setInterval( function(){
    // document.getElementById("seconds").innerHTML=pad(++sec%60);
    // document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
	// if(score >= 10){
		// if(Math.floor(sec/60) === 0){
		// 	fin_statement = "Done! you finished in " + (++sec%60 - 1) + " seconds.";
		// }
		// else {
		// 	fin_statement = "Done! you finished in " + Math.floor(sec/60) + " minutes and " + (++sec%60) + " seconds.";
		// }
		//document.getElementById('finish').innerHTML = fin_statement;
		// document.getElementById("colorGame").style.display = "none";
		// document.getElementById("mazeGame").style.display = "block";
	// 	clearInterval(refreshTimer);
	// }
 //  }, 1000);