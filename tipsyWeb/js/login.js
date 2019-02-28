//Author: Neville Morgan

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    document.getElementById('login-page').style.display = "none";
    document.getElementById('logged-in').style.display = "block";
    document.getElementById('logged-inbtn').style.display = "block";
    document.getElementById('signup-btn').style.display = "none";


  } else {
    // No user is signed in.
    document.getElementById('login-page').style.display = "block";
    document.getElementById('logged-in').style.display = "none";
    document.getElementById('logged-inbtn').style.display = "none";
    document.getElementById('signup-btn').style.display = "block";
  }
});

function login() {
  var user_email = document.getElementById('email').value;
  var user_password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(user_email, user_password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;

  window.alert("Error :" + errorMessage);

  });
}

function logout() {
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  }).catch(function(error) {
  // An error happened.
  });
}
