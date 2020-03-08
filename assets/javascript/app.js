// Initializing Firebase
var config = {
    apiKey: "AIzaSyCBxxMlG98pkSAhDS_PYYiHhbNsfhr9pZw",
    authDomain: "aaron-s-proj.firebaseapp.com",
    databaseURL: "https://aaron-s-proj.firebaseio.com",
    projectId: "aaron-s-proj",
    storageBucket: "aaron-s-proj.appspot.com",
    messagingSenderId: "647503107901",
    appId: "1:647503107901:web:108cf101cbec4c6dac5754",
    measurementId: "G-09QSXMMXCB"
};

firebase.initializeApp(config);

var database = firebase.database();


// Event handler and function for adding a train schedule
$(".submit-button").on("click", function (event) {
    event.preventDefault();

    // get values from user input
    var trainName = $("#train-name").val().trim();
    var dest = $("#destination").val().trim();
    var firstTime = moment($("#first-time").val().trim(), "hh:mm").format("X");
    var freq = $("#frequency").val().trim();

    // make the new train an object
    var newTrain = {
        name: trainName,
        dest: dest,
        firstTime: firstTime,
        freq: freq
    };

    // push newTrain object to firebase
    database.ref().push(newTrain);

    // Logs values to console
    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.firstTime);
    console.log(newTrain.freq);


    // Clears the input fields
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-time").val("");
    $("#frequency").val("");
});