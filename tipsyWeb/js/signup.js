//Author: Neville Morgan

/*firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    document.getElementById('login-page').style.display = "none";
    document.getElementById('logged-in').style.display = "block";
    document.getElementById('logged-inbtn').style.display = "block";
    document.getElementById('signup-btn').style.display = "none";

    var user = firebase.auth().currentUser;
    if(user != null){
      var email_id = user.email;
    }

  } else {
    // No user is signed in.
    document.getElementById('login-page').style.display = "block";
    document.getElementById('logged-in').style.display = "none";
    document.getElementById('logged-inbtn').style.display = "none";
    document.getElementById('signup-btn').style.display = "block";
  }
});*/

function register() {
     var email = document.getElementById('email').value;
     var password = document.getElementById('password').value;
     var cpassword = document.getElementById('cpassword').value;
     if (cpassword != password){
       alert('Passwords did not match!');
     }
     if (email.length < 2) {
       alert('Please enter an email address.');
       return;
     }
     if (password.length < 2) {
       alert('Please enter a password.');
       return;
     }
     // Sign in with email and pass.
     firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       if (errorCode == 'auth/weak-password') {
         alert('The password is too weak.');
       } else {
         alert(errorMessage);
       }
       console.log(error);
     });

     firebase.auth().currentUser.sendEmailVerification()

     alert('Email Verification Sent!');

     window.location.assign("profile.html");
}
