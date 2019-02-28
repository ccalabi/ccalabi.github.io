//Author: Neville Morgan

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    document.getElementById('login').style.display = "none";
    document.getElementById('logout').style.display = "block";
    document.getElementById('profile').style.display = "block";


  } else {
    // No user is signed in.
    document.getElementById('login').style.display = "block";
    document.getElementById('logout').style.display = "none";
    document.getElementById('profile').style.display = "none";
  }
});

function logout() {
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  }).catch(function(error) {
  // An error happened.
  });
}
