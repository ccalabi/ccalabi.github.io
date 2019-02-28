//Author: Neville Morgan

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user.email + " is signed in.");
    //var user_data;
    getData();
    //loadData(user_data);
    console.log(user.displayName);
    if(user.displayName){
      console.log(user.displayName);
    }else{
      alert("Please update your information and then set a baseline!")
    }
  }else {
    alert("Please login to view profile!");
    window.location.assign("login.html");
  }
});


function getData() {
  var database = firebase.database();
  var user = firebase.auth().currentUser;
  if(user.displayName){
    var ref = database.ref('users/' + user.uid);
    var user_values;
    ref.on('value', function(snap){
      user_values = snap.val();
      console.log(user_values);
      var user_name = user_values.username;
      var user_date = user_values.date_of_birth;
      var user_score = user_values.score;
      var user_weight = user_values.weight;
      var user_build = user_values.build;
      console.log(user_name);
      console.log(user_weight);
      document.getElementById("email").value = user_values.email;
      document.getElementById("name").value = user_name;
      if (user_score){
        document.getElementById("score").innerHTML = user_score;
      }else{
        document.getElementById("score").innerHTML = "Please set your baseline.";
      }
      document.getElementById("weight").value = user_weight;
      document.getElementById("date").value = user_date;
      document.getElementById("build").value = user_build;

    });
  }else{
    document.getElementById("email").value = user.email;
    document.getElementById("score").innerHTML = "  Please set your baseline.";

  }
}

function updateUser () {
  var database = firebase.database();
  var user = firebase.auth().currentUser;
  var user_id = user.uid;
  var current_name = user.displayName;
  var user_email = document.getElementById('email').value;
  var name = document.getElementById('name').value;
  var user_date = document.getElementById('date').value;
  var user_weight = document.getElementById('weight').value;
  var user_build = document.getElementById('build').value;

  if(current_name){

    user.updateProfile({
    displayName: name,
    }).then(function() {
    // Update successful.
      console.log("user name updated!");
    }).catch(function(error) {
    // An error happened.
      console.log("user name update failed!");
    });

    user.updateEmail(user_email).then(function() {
    // Update successful.
    console.log("user email updated!");
    }).catch(function(error) {
    // An error happened.
    console.log("user email updated failed!");
    });


    database.ref('users/' + user_id).update({
      date_of_birth: user_date,
      username: name,
      weight: user_weight,
      build: user_build
    });


  }else{
    writeUserData(user_id, name, user_email, user_date, user_weight, user_build);
  }
  alert("Your Information has been updated!");
}

function writeUserData(userId, name, email, date, weight, build) {
  var user = firebase.auth().currentUser;
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    date_of_birth: date,
    weight: weight,
    build: build,
    score: 0
  });
  user.updateProfile({
  displayName: name,
  }).then(function() {
  // Update successful.
    console.log("display name updated!");
  }).catch(function(error) {
  // An error happened.
    console.log("display name update failed!");
  });
}

function logout() {
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  }).catch(function(error) {
  // An error happened.
  });
}
