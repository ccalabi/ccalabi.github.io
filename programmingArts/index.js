$(document).ready(function() {
	
	var questions = ["Which location appeals to you most?", 
					 "What do you do?",
					 "Which word best describes you?",
					 "In your group you are:",
					 "What is important to you?",
					 "Which special skill would you like to have?",
					 "How do you deal with disappointment or failure?",
					 "What is your deepest desire?",
					 "What is your greatest fear?",
					 "Choose your weapon:",
					 "What do you do?",
					 "How will you die?"];
					 

	var location = [];

	var LukeWillow = [];
	
	var DarthYew = [];
	
	var ObiCedar = [];
	
	var KyloHawthorn = [];


	//Shows design, challenges, etc.
	$('.dropdownButton').click(function() {
		dropdownButton()
	});

	function dropdownButton() {
		$(".dropdown").toggle("show");
	};


	//Loads first question & answers					 	
	$('.button1q').click(function() {
		$("#start").hide(); loadQuestion1();
	});
		function loadQuestion1() {
			var question1 = questions[0];
			$('#output1q').html("<div>"+question1+"</div>");
			//console.log("success1");
			$("#answer1Buttons").show();
			//console.log("success1a");
		} 



	//Loads second question	& answers, hides previous, stores answer value
	$('.button1a1').click(function() {
		pushLocationH(); $("#Hogwarts").show(); loadQuestion2()
	});
	
		function pushLocationH() {
			var h = 1;
			location.push(h);
			//console.log("yay");
		}

	$('.button1a2').click(function() {
		pushLocationE(); $("#Endor").show(); loadQuestion2() 
	});

		function pushLocationE() {
			var e = 2;
			location.push(e);
			//console.log("yay");
		}

	$('.button1a3').click(function() {
		pushLocationDA(); $("#DiagonAlley").show(); loadQuestion2()
	});
			
		function pushLocationDA() {
			var d = 3;
			location.push(d);
			//console.log("yay");
		}

	$('.button1a4').click(function() {
		pushLocationC(); $("#Coruscant").show(); loadQuestion2()
	});
		
		function pushLocationC() {
			var c = 4;
			location.push(c);
			//console.log("yay");
		}

		function loadQuestion2() {
			var question2 = questions[1];
			$('#output1q').html("<div>"+question2+"</div>");
			//console.log("success2");
			$("#answer1Buttons").hide();
			$("#answer2Buttons").show();
			console.log("success2a");
		}

		
		
	//Loads third question	& answers, hides previous, stores answer value
	$('.button2a5').click(function() {
		loadQuestion3();
	});

	$('.button2a6').click(function() {
		loadQuestion3();
	});

	$('.button2a7').click(function() {
		loadQuestion3();
	});
	
	$('.button2a8').click(function() {
		loadQuestion3();
	});
	
		function loadQuestion3() {
			var question3 = questions[2];
			$('#output1q').html("<div>"+question3+"</div>");
			//console.log("success3");
			$("#answer2Buttons").hide();
			$("#Hogwarts").hide();
			$("#Endor").hide();
			$("#DiagonAlley").hide();
			$("#Coruscant").hide();
			$("#answer3Buttons").show();
			//console.log("success3a");
			}



	//Loads fourth question	& answers, hides previous, stores answer value
	$('.button3a9').click(function() {
		loadQuestion4(); pushAnswer9()
	});

	$('.button3a10').click(function() {
		loadQuestion4(); pushAnswer10()
	});

	$('.button3a11').click(function() {
		loadQuestion4(); pushAnswer11()
	});
	
	$('.button3a12').click(function() {
		loadQuestion4(); pushAnswer12()
	});

	$('.button3a13').click(function() {
		loadQuestion4(); pushAnswer13()
	});

	$('.button3a14').click(function() {
		loadQuestion4(); pushAnswer14()
	});

	$('.button3a15').click(function() {
		loadQuestion4(); pushAnswer15()
	});
	
	$('.button3a16').click(function() {
		loadQuestion4(); pushAnswer16()
	});

		function pushAnswer9() {
			var c = -6;
			LukeWillow.push(c);
			//console.log(LukeWillow);
			var c1 = -10;
			ObiCedar.push(c1);
			//console.log(ObiCedar);
			var c2 = 10;
			KyloHawthorn.push(c2);
			//console.log(KyloHawthorn);
		} 
		
		function pushAnswer10() {
			var c = -5;
			LukeWillow.push(c);
			//console.log(LukeWillow);
			var c1 = 10;
			DarthYew.push(c1);
			//console.log(DarthYew);
		}
		
		function pushAnswer11() {
			var c = 10;
			DarthYew.push(c);
			//console.log(DarthYew);
		}

		function pushAnswer12() {
			var c = 10;
			ObiCedar.push(c);
			//console.log(ObiCedar);
			var c1 = -5;
			KyloHawthorn.push(c1);
			//console.log(KyloHawthorn);
		} 
		
		function pushAnswer13() {
			var c = -5;
			ObiCedar.push(c);
			//console.log(ObiCedar);
			var c1 = 10;
			KyloHawthorn.push(c1);
			//console.log(KyloHawthorn);
		}
		
		function pushAnswer14() {
			var c = 10;
			ObiCedar.push(c);
			//console.log(ObiCedar);
			var c1 = -10;
			KyloHawthorn.push(c1);
			//console.log(KyloHawthorn);
		}
		function pushAnswer15() {
			var c = 7;
			LukeWillow.push(c);
			//console.log(LukeWillow);
		} 
		
		function pushAnswer16() {
			var c = 10;
			LukeWillow.push(c);
			//console.log(LukeWillow);
		}

		function loadQuestion4() {
			var question4 = questions[3];
			$('#output1q').html("<div>"+question4+"</div>");
			//console.log("success4");
			$("#answer3Buttons").hide();
			$("#answer4Buttons").show();
			//console.log("success4a");
		} 
	
		
		
	//Loads fifth question & answers, hides previous, stores answer value
	$('.button4a17').click(function() {
		loadQuestion5(); pushAnswer17()
	});

	$('.button4a18').click(function() {
		loadQuestion5(); pushAnswer18()
	});

	$('.button4a19').click(function() {
		loadQuestion5(); pushAnswer19()
	});
	
	$('.button4a20').click(function() {
		loadQuestion5(); pushAnswer20()
	});

	$('.button4a21').click(function() {
		loadQuestion5(); pushAnswer21()
	});

		function pushAnswer17() {
			var d = 10;
			DarthYew.push(d);
			//console.log(DarthYew);
		} 
		
		function pushAnswer18() {
			var d = 7;
			LukeWillow.push(d);
			//console.log(LukeWillow);
			var d1 = -5;
			DarthYew.push(d1);
			//console.log(DarthYew);
			var d2 = 7;
			ObiCedar.push(d2);
			//console.log(ObiCedar);
			var d3 = -5;
			KyloHawthorn.push(d3);
			//console.log(KyloHawthorn);
		} 

		function pushAnswer19() {
			var d = 10;
			ObiCedar.push(d);
			//console.log(ObiCedar);
		} 

		function pushAnswer20() {
			var d = -10;
			LukeWillow.push(d);
			//console.log(LukeWillow);
			var d1 = 10;
			KyloHawthorn.push(d1);
			//console.log(KyloHawthorn);
		} 
	
		function pushAnswer21() {
			var d = 10;
			LukeWillow.push(d);
			//console.log(LukeWillow);
		} 
					
		function loadQuestion5() {
			var question5 = questions[4];
			$('#output1q').html("<div>"+question5+"</div>");
			//console.log("success5");
			$("#answer4Buttons").hide();
			$("#answer5Buttons").show();
			//console.log("success5a");
		} 
	
		
		
	//Loads sixth question & answers, hides previous, stores answer value
	$('.button5a22').click(function() {
		loadQuestion6(); pushAnswer22()
	});
	
	$('.button5a23').click(function() {
		loadQuestion6(); pushAnswer23()
	});
		
	$('.button5a25').click(function() {
		loadQuestion6(); pushAnswer25()
	});
	
	$('.button5a26').click(function() {
		loadQuestion6(); pushAnswer26()
	});
	
	$('.button5a27').click(function() {
		loadQuestion6(); pushAnswer27()
	});
	
	$('.button5a28').click(function() {
		loadQuestion6(); pushAnswer28()
	});
	
	$('.button5a29').click(function() {
		loadQuestion6(); pushAnswer29()
	});

		function pushAnswer22() {
			var e = 10;
			DarthYew.push(e);
			//console.log(DarthYew);
		} 
		
		function pushAnswer23() {
			var e = 10;
			ObiCedar.push(e);
			//console.log(ObiCedar);
		} 

		function pushAnswer25() {
			var e = 10;
			KyloHawthorn.push(e);
			//console.log(KyloHawthorn);
		} 
	
		function pushAnswer26() {
			var e = 10;
			LukeWillow.push(e);
			//console.log(LukeWillow);
		} 
		
		function pushAnswer27() {
			var e = 10;
			DarthYew.push(e);
			//console.log(DarthYew);
		} 
			
		function pushAnswer28() {
			var e = 10;
			KyloHawthorn.push(e);
			//console.log(KyloHawthorn);
		} 
		
		function pushAnswer29() {
			var e = 10;
			LukeWillow.push(e);
			//console.log(LukeWillow);
		} 
			
		function loadQuestion6() {
			var question6= questions[5];
			$('#output1q').html("<div>"+question6+"</div>");
			//console.log("success6");
			$("#answer5Buttons").hide();
			$("#answer6Buttons").show();
			//console.log("success6a");
		} 




	//Loads seventh question & answers, hides previous, stores answer value
	$('.button6a30').click(function() {
		callLocation(); loadQuestion7(); pushAnswer30()
	});
	
	$('.button6a31').click(function() {
		callLocation(); loadQuestion7(); pushAnswer31()
	});
	
	$('.button6a32').click(function() {
		callLocation(); loadQuestion7(); pushAnswer32()
	});
		
	$('.button6a34').click(function() {
		callLocation(); loadQuestion7(); pushAnswer34()
	});
	
	$('.button6a35').click(function() {
		callLocation(); loadQuestion7(); pushAnswer35()
	});

		function pushAnswer30() {
			var f = 10;
			LukeWillow.push(f);
			//console.log(LukeWillow);
		} 
		
		function pushAnswer31() {
			var f = 10;
			ObiCedar.push(f);
			//console.log(ObiCedar);
		} 

		function pushAnswer32() {
			var f = 10;
			LukeWillow.push(f);
			//console.log(LukeWillow);
		} 
	
		function pushAnswer34() {
			var f = 10;
			KyloHawthorn.push(f);
			//console.log(KyloHawthorn);
		} 
		
		function pushAnswer35() {
			var f = 10;
			DarthYew.push(f);
			//console.log(DarthYew);
		} 
			
		function loadQuestion7() {
			var question7= questions[6];
			$('#output1q').html("<div>"+question7+"</div>");
			//console.log("success7");
			$("#answer6Buttons").hide();
			$("#answer7Buttons").show();
			//console.log("success7a");
		} 
		
		function callLocation() {
			if (location[0] == 1) {
				$("#failHogwarts").show();
			} 
				else if (location[0] == 2) {
					$("#failEndor").show();
				}
				else if (location[0] == 3) {
					$("#failDiagonAlley").show();
				}
				else if (location[0] == 4) {
					$("#failCoruscant").show();
				}
		}



	//Loads eighth question & answers, hides previous, stores answer value
	$('.button7a36').click(function() {
		loadQuestion8(); pushAnswer36()
	});
	
	$('.button7a37').click(function() {
		loadQuestion8(); pushAnswer37()
	});
	
	$('.button7a38').click(function() {
		loadQuestion8(); pushAnswer38()
	});
	
	$('.button7a39').click(function() {
		loadQuestion8(); pushAnswer39()
	});
	
	$('.button7a40').click(function() {
		loadQuestion8(); pushAnswer40()
	});
	
	$('.button7a41').click(function() {
		loadQuestion8(); pushAnswer41()
	});
	
	$('.button7a42').click(function() {
		loadQuestion8(); pushAnswer42()
	});
	
	$('.button7a43').click(function() {
		loadQuestion8(); pushAnswer43()
	});
	
		function pushAnswer36() {
			var g = 10;
			LukeWillow.push(g);
			//console.log(LukeWillow);
		} 
		
		function pushAnswer37() {
			var g = 10;
			LukeWillow.push(g);
			//console.log(LukeWillow);
			var g1 = -5;
			KyloHawthorn.push(g1);
			//console.log(KyloHawthorn);
		} 

		function pushAnswer38() {
			var g = 10;
			DarthYew.push(g);
			//console.log(DarthYew);
		} 

		function pushAnswer39() {
			var g = -5;
			DarthYew.push(g);
			//console.log(DarthYew);
			var g1 = 10;
			ObiCedar.push(g1);
			//console.log(ObiCedar);
			var g2 = -5;
			KyloHawthorn.push(g2);
			//console.log(KyloHawthorn);
		} 
	
		function pushAnswer40() {
			var g = 10;
			KyloHawthorn.push(g);
			//console.log(KyloHawthorn);
		} 
		
		function pushAnswer41() {
			var g = 10;
			ObiCedar.push(g);
			//console.log(ObiCedar);
		} 

		function pushAnswer42() {
			var g = -5;
			LukeWillow.push(g);
			//console.log(LukeWillow);
			var g1 = 10;
			DarthYew.push(g1);
			//console.log(DarthYew);
			var g2 = -10;
			ObiCedar.push(g2);
			//console.log(ObiCedar);			
			var g3 = 3;
			KyloHawthorn.push(g3);
			//console.log(KyloHawthorn);
		} 
		
		function pushAnswer43() {
			var g = 10;
			KyloHawthorn.push(g);
			//console.log(KyloHawthorn);
			var g1 = -5;
			LukeWillow.push(g1);
			//console.log(LukeWillow);
			var g2 = -10;
			ObiCedar.push(g2);
			//console.log(ObiCedar);
		} 
			
		function loadQuestion8() {
			var question8= questions[7];
			$('#output1q').html("<div>"+question8+"</div>");
			//console.log("success8");
			$("#answer7Buttons").hide();
			$("#failHogwarts").hide();
			$("#failEndor").hide();
			$("#failDiagonAlley").hide();
			$("#failCoruscant").hide();
			$("#answer8Buttons").show();
			//console.log("success8a");
		} 




	//Loads ninth question & answers, hides previous, stores answer value
	$('.button8a44').click(function() {
		loadQuestion9(); pushAnswer44()
	});
	
	$('.button8a45').click(function() {
		loadQuestion9(); pushAnswer45()
	});
	
	$('.button8a46').click(function() {
		loadQuestion9(); pushAnswer46()
	});
	
	$('.button8a47').click(function() {
		loadQuestion9(); pushAnswer47()
	});
	
	$('.button8a48').click(function() {
		loadQuestion9(); pushAnswer48()
	});
	
	$('.button8a49').click(function() {
		loadQuestion9(); pushAnswer49()
	});
	
	$('.button8a50').click(function() {
		loadQuestion9(); pushAnswer50()
	});
	
	$('.button8a51').click(function() {
		loadQuestion9(); pushAnswer51()
	});
	
		function pushAnswer44() {
			var h = 10;
			KyloHawthorn.push(h);
			//console.log(KyloHawthorn);
		} 
		
		function pushAnswer45() {
			var h = 10;
			LukeWillow.push(h);
			//console.log(LukeWillow);
		} 

		function pushAnswer46() {
			var h = 10;
			ObiCedar.push(h);
			//console.log(ObiCedar);
		} 

		function pushAnswer47() {
			var h = 10;
			ObiCedar.push(h);
			//console.log(ObiCedar);
			var h1 = -3;
			KyloHawthorn.push(h1);
			//console.log(KyloHawthorn);
		} 
	
		function pushAnswer48() {
			var h = 10;
			KyloHawthorn.push(h);
			//console.log(KyloHawthorn);
		} 
		
		function pushAnswer49() {
			var h = 10;
			DarthYew.push(h);
			//console.log(DarthYew);
			var h1 = -3;
			ObiCedar.push(h1);
			//console.log(ObiCedar);
		} 

		function pushAnswer50() {
			var h = 10;
			LukeWillow.push(h);
			//console.log(LukeWillow);
		} 
		
		function pushAnswer51() {
			var h = 10;
			DarthYew.push(h);
			//console.log(DarthYew);
		} 
			
		function loadQuestion9() {
			var question9= questions[8];
			$('#output1q').html("<div>"+question9+"</div>");
			//console.log("success9");
			$("#answer8Buttons").hide();
			$("#answer9Buttons").show();
			//console.log("success9a");
		} 




	//Loads tenth question & answers, hides previous, stores answer value
	$('.button9a52').click(function() {
		loadQuestion10(); pushAnswer52()
	});
	
	$('.button9a53').click(function() {
		loadQuestion10(); pushAnswer53()
	});
	
	$('.button9a54').click(function() {
		loadQuestion10(); pushAnswer54()
	});
	
	$('.button9a55').click(function() {
		loadQuestion10(); pushAnswer55()
	});
	
	$('.button9a56').click(function() {
		loadQuestion10(); pushAnswer56()
	});
	
	$('.button9a57').click(function() {
		loadQuestion10(); pushAnswer57()
	});
	
	$('.button9a58').click(function() {
		loadQuestion10(); pushAnswer58()
	});
		
		function pushAnswer52() {
			var i = 10;
			LukeWillow.push(i);
			//console.log(LukeWillow);
		} 
		
		function pushAnswer53() {
			var i = 10;
			LukeWillow.push(i);
			//console.log(LukeWillow);
		} 

		function pushAnswer54() {
			var i = 10;
			ObiCedar.push(i);
			//console.log(ObiCedar);
		} 

		function pushAnswer55() {
			var i = 10;
			KyloHawthorn.push(i);
			//console.log(KyloHawthorn);
		} 
	
		function pushAnswer56() {
			var i = 10;
			KyloHawthorn.push(i);
			//console.log(KyloHawthorn);
		} 
		
		function pushAnswer57() {
			var i = 10;
			DarthYew.push(i);
			//console.log(DarthYew);
		} 

		function pushAnswer58() {
			var i = 10;
			DarthYew.push(i);
			//console.log(DarthYew);
		} 
			
		function loadQuestion10() {
			var question10= questions[9];
			$('#output1q').html("<div>"+question10+"</div>");
			//console.log("success10");
			$("#answer9Buttons").hide();
			$("#answer10Buttons").show();
			//console.log("success10a");
		} 




	//Loads eleventh question & answers, hides previous	
	$('.button10a62').click(function() {
		callLocationStory(); callFireboltStory(); loadQuestion11(); 
	});
		
	$('.button10a63').click(function() {
		callLocationStory(); callLightsaberStory(); loadQuestion11(); 
	});
	
	$('.button10a65').click(function() {
		callLocationStory(); callATATStory(); loadQuestion11(); 
	});
	
	$('.button10a66').click(function() {
		callLocationStory(); callInvisibilityStory(); loadQuestion11(); 
	});
			
		function loadQuestion11() {
			var question11= questions[10];
			$('#output1q').html("<div>"+question11+"</div>");
			//console.log("success11");
			$("#answer10Buttons").hide();
			$("#answer11Buttons").show();
			//console.log("success11a");
		} 
		
		function callLocationStory() {
			if (location[0] == 1) {
				$("#HogwartsStory").show();
			} 
				else if (location[0] == 2) {
					$("#EndorStory").show();
				}
				else if (location[0] == 3) {
					$("#DiagonAlleyStory").show();
				}
				else if (location[0] == 4) {
					$("#CoruscantStory").show();
				}
		}
				
		function callFireboltStory() {
			if (location[0] == 1) {
				$("#HogwartsFirebolt").show();
			} 
				else if (location[0] == 2) {
					$("#EndorFirebolt").show();
				}
				else if (location[0] == 3) {
					$("#DiagonAlleyFirebolt").show();
				}
				else if (location[0] == 4) {
					$("#CoruscantFirebolt").show();
				}	
		}
		
		function callLightsaberStory() {
			if (location[0] == 1) {
				$("#HogwartsLightsaber").show();
			} 
				else if (location[0] == 2) {
					$("#EndorLightsaber").show();
				}
				else if (location[0] == 3) {
					$("#DiagonAlleyLightsaber").show();
				}
				else if (location[0] == 4) {
					$("#CoruscantLightsaber").show();
				}	
		}		
		
		function callATATStory() {
			if (location[0] == 1) {
				$("#HogwartsATAT").show();
			} 
				else if (location[0] == 2) {
					$("#EndorATAT").show();
				}
				else if (location[0] == 3) {
					$("#DiagonAlleyATAT").show();
				}
				else if (location[0] == 4) {
					$("#CoruscantATAT").show();
				}	
		}

		function callInvisibilityStory() {
			if (location[0] == 1) {
				$("#HogwartsInvisibility").show();
			} 
				else if (location[0] == 2) {
					$("#EndorInvisibility").show();
				}
				else if (location[0] == 3) {
					$("#DiagonAlleyInvisibility").show();
				}
				else if (location[0] == 4) {
					$("#CoruscantInvisibility").show();
				}	
		}




	//Loads twelfth question & answers, hides previous	
	$('.button11a71').click(function() {
		loadQuestion12(); 
	});
	
	$('.button11a72').click(function() {
		loadQuestion12(); 
	});
	
	$('.button11a73').click(function() {
		loadQuestion12(); 
	});
	
	$('.button11a74').click(function() {
		loadQuestion12(); 
	});
			
		function loadQuestion12() {
			var question12= questions[11];
			$('#output1q').html("<div>"+question12+"</div>");
			//console.log("success12");
			$("#answer11Buttons").hide();
			$("#HogwartsStory").hide();
			$("#EndorStory").hide();
			$("#DiagonAlleyStory").hide();
			$("#CoruscantStory").hide();
			$("#HogwartsFirebolt").hide();
			$("#EndorFirebolt").hide();
			$("#DiagonAlleyFirebolt").hide();
			$("#CoruscantFirebolt").hide();
			$("#HogwartsLightsaber").hide();
			$("#EndorLightsaber").hide();
			$("#DiagonAlleyLightsaber").hide();
			$("#CoruscantLightsaber").hide();
			$("#HogwartsATAT").hide();
			$("#EndorATAT").hide();
			$("#DiagonAlleyATAT").hide();
			$("#CoruscantATAT").hide();
			$("#HogwartsInvisibility").hide();
			$("#EndorInvisibility").hide();
			$("#DiagonAlleyInvisibility").hide();
			$("#CoruscantInvisibility").hide();
			$("#answer12Buttons").show();
			//console.log("success12a");
		} 


	//Hides previous, shows personality result
	$('.button12a75').click(function() {
		hideAnswers()
	});
	
	$('.button12a76').click(function() {
		hideAnswers()
	});
	
	$('.button12a77').click(function() {
		hideAnswers()
	});
	
	$('.button12a78').click(function() {
		hideAnswers()
	});
	
	$('.button12a79').click(function() {
		hideAnswers()
	});
	
	$('.button12a80').click(function() {
		hideAnswers()
	});
	
	$('.button12a81').click(function() {
		hideAnswers()
	});
		
		function hideAnswers() {
			$("#answer12Buttons").hide();
			$("#output1q").hide();
			$("#personalityReveal").show();
			//console.log("success12a");
		} 
		
		
		$('.revealPersonality').click(function() {
			calculatePersonality(); showPersonality();
		});	


		//from stackoverflow user Amber
		var total1 = 0;
		var total2 = 0;
		var total3 = 0;
		var total4 = 0;

		
		function calculatePersonality() {
			for(var i in LukeWillow) {
				total1 += LukeWillow[i]; }
			//console.log("LukeWillow: " + total1);			
			
			for(var i in DarthYew) {
				total2 += DarthYew[i]; }
			//console.log("DarthYew: " + total2);			
			
			for(var i in ObiCedar) {
				total3 += ObiCedar[i]; }
			//console.log("ObiCedar: " + total3);			
		
			for(var i in KyloHawthorn) {
				total4 += KyloHawthorn[i]; }
			//console.log("KyloHawthorn: " + total4);
		};
		
		function showPersonality() {
			$("#personality1").show();
			$('#ptotal1').append("<div>"+total1+"</div>");			
			$("#personality2").show();
			$('#ptotal2').append("<div>"+total2+"</div>");			
			$("#personality3").show();
			$('#ptotal3').append("<div>"+total3+"</div>");			
			$("#personality4").show();
			$('#ptotal4').append("<div>"+total4+"</div>");	
			$("#personalityReveal").hide();		
			//console.log("answers printed!");
		}
		
		
});
