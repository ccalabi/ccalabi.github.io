//Author: Clement Leung

var verbs, nouns, adj, adverb, content, oldContent, score = 0;

verbs = ["is", "strives", "wants", "kills","desires","beats","destroys","eliminates","drinks","eats"];
nouns = ["dog", "hamster", "lion", "cat","human","person","people","alien","mouse","ball"];
adj = ["smart","dumb","excellent","best","worst","rough","dreadful","dirty","dark","light"];
adverb = ["slowly","quickly","calmly","haphazardly","sadly","humbly","proudly","finally","happily","precisely"];

function sentenceCreate(){
  if (score < 3) {
    var rand1 = Math.ceil(Math.random() * 10);
    var rand2 = Math.floor(Math.random() * 10);
    var rand3 = Math.ceil(Math.random() * 10);
    var rand4 = Math.floor(Math.random() * 10);	
    content = "The " + adj[rand2] + " " +nouns[rand1]+" "+ adverb[rand4]+" "+verbs[rand1] + " " + nouns[rand4] +".";
    // oldContent = document.getElementById('toType').innerHTML;  
    document.getElementById('toType').innerHTML = content;		
  }
  else {
	getTime();
    document.getElementById("sentenceGame").style.display = "none";
    document.getElementById("mathGame").style.display = "block";
  }
}

function sentenceSubmit(){
  var scoreText = "Score: "; 
  //var sentence = "I want to be safe and sober!!!!";
  oldContent = document.getElementById('toType').innerHTML;
  var x = document.getElementById("textinput").value.trim();
  var out = "";
  // if (score < 1) {
  //   oldContent = sentence;
  // }
  if (x != oldContent){
	  out = "Incorrect, please type again!";
    document.getElementById("textinput").value = x;	  
  } 
  else {
    score += 1;
    out = "Sentence correctly typed."
    document.getElementById("textinput").value = "";
    sentenceCreate();
  }
  document.getElementById("feeds").innerHTML = out; 
  document.getElementById('Score').innerHTML = (scoreText+score);	
}

// function startup(){
//  document.getElementById("mathGame").style.display = "none";
//  document.getElementById("colorGame").style.display = "none";
// }

window.onload = function() {
 //document.getElementById("toType").innerHTML = "I want to be safe and sober!";
 // startup();
 var myInput = document.getElementById('textinput');
 document.getElementById("seconds1").style.display = "none";
 document.getElementById("minutes1").style.display = "none";
 document.getElementById("colon").style.display = "none";
 myInput.onpaste = function(e) {
   e.preventDefault();
 }
}



 

