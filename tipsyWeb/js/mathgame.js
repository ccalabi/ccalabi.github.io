//Author: Cori Calabi

window.onload = function () {
	
	var numberOne;
	var numberTwo;
	var numberOp;
	var operations = ["+", "-", "*", "/"];
	var userAnswer;
	var trueAnswer;
	var correctCount = 0;
	
	// var seconds = 00;
	// var tens = 00;
	// var Interval;
	
	var question = document.getElementById("question");
	var inputArea = document.getElementById("numinput");
	var inCorrect = document.getElementById("inCorrect");
	var submitBtn = document.getElementById("mathsubmit");
	var Btn1 = document.getElementById("one");
	var Btn2 = document.getElementById("two");
	var Btn3 = document.getElementById("three");
	var Btn4 = document.getElementById("four");
	var Btn5 = document.getElementById("five");
	var Btn6 = document.getElementById("six");
	var Btn7 = document.getElementById("seven");
	var Btn8 = document.getElementById("eight");
	var Btn9 = document.getElementById("nine");
	var Btn0 = document.getElementById("zero");
	var BtnClear = document.getElementById("reset");
	var scoreArea = document.getElementById("mathscore");

	function loadQuestion() {
		if (correctCount < 5) {
			numberOne = Math.floor(Math.random() * 13);
			numberTwo = Math.floor(Math.random() * 13);
			numberOp = Math.floor(Math.random() * 4);
			// if doing division, check for division by zero and non-integer answers
			if (numberOp == 3) {
				if (numberTwo == 0) {
					numberTwo = Math.floor((Math.random() * 12) + 1);
				}
				while (!Number.isInteger(numberOne/numberTwo)) {
					numberOne = Math.floor(Math.random() * 13);
					numberTwo = Math.floor((Math.random() * 12) + 1);
				}
			}
			// if doing subtraction, check for negative answers
			else if (numberOp == 1) {
				while ((numberOne - numberTwo) < 0) {
					numberOne = Math.floor(Math.random() * 13);
				}
			}
			// Write the question on the page
			var s1 = numberOne.toString();
			var s2 = numberTwo.toString();
			var sOp = operations[numberOp];
			question.innerHTML = s1 + " " + sOp + " " + s2 + " =";
		}
		else {
			getTime();
			document.getElementById("mathGame").style.display = "none";
			document.getElementById("colorGame").style.display = "block";
			//stopTimer();
			//inCorrect.innerHTML = "Good job! You finished the game.";
			// inputArea.style.display = "none";
			// question.style.display = "none";
			// document.getElementById("buttons").style.display = "none";				
		}
	}


	// Check the user's answer after they click/tap submit button
	submitBtn.addEventListener("click", checkAnswer);
	window.addEventListener("keypress", function(e) {
		if (e.keyCode == 13) {
			checkAnswer();
		}
	});

	function checkAnswer() {
		userAnswer = inputArea.value;
		if (numberOp == 0) {
			trueAnswer = numberOne + numberTwo;
		} else if (numberOp == 1) {
			trueAnswer = numberOne - numberTwo;
		} else if (numberOp == 2) {
			trueAnswer = numberOne * numberTwo;
		} else {
			trueAnswer = numberOne / numberTwo;
		}

		if (userAnswer == trueAnswer) {
			inCorrect.innerHTML = "Correct! Next Question:";
			inputArea.value = inputArea.defaultValue;
			correctCount += 1;
			loadQuestion();
		} else {
			inCorrect.innerHTML = "Sorry, Incorrect, Try Again";
			inputArea.value = inputArea.defaultValue;
		}
		var scoreText = "Score: ";
		scoreArea.innerHTML = (scoreText + correctCount);
	}

// Following code makes the number buttons work

	Btn1.addEventListener("click", function() {
		clickNumButton(1);
	});
	Btn2.addEventListener("click", function() {
		clickNumButton(2);
	});
	Btn3.addEventListener("click", function() {
		clickNumButton(3);
	});
	Btn4.addEventListener("click", function() {
		clickNumButton(4);
	});
	Btn5.addEventListener("click", function() {
		clickNumButton(5);
	});
	Btn6.addEventListener("click", function() {
		clickNumButton(6);
	});
	Btn7.addEventListener("click", function() {
		clickNumButton(7);
	});
	Btn8.addEventListener("click", function() {
		clickNumButton(8);
	});
	Btn9.addEventListener("click", function() {
		clickNumButton(9);
	});
	Btn0.addEventListener("click", function() {
		clickNumButton(0);
	});

	function clickNumButton(num) {
		var sNum = num.toString();
		var temp = inputArea.value;
		var newValue = temp.concat(sNum);
		inputArea.value = newValue;
	}

	BtnClear.addEventListener("click", function() {
		inputArea.value = "";
	});
	

// Add a timer that starts when the page is loaded, time stored in variables seconds and tens
// Based on code from: https://codepen.io/cathydutton/pen/GBcvo
	// function timer() {
	// 	clearInterval(Interval);
	// 	Interval = setInterval(startTimer, 10);
	// }

	// function startTimer() {
	// 	tens++;
	// 	if (tens > 99) {
	// 		console.log(seconds);
	// 		seconds++;
	// 		tens = 0;
	// 	}
	// }

	// function stopTimer() {
	// 	clearInterval(Interval);
	// 	console.log(seconds + ":" + tens);
	// }


	
	loadQuestion();
	// timer();

}

