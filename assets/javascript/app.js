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

// Function to put current date and time on page as "clock" and update the schedule section every minute on the minute.
function updateStuff() {
    var currentDate = moment().format("MMMM Do YYYY")
    var currentTime = moment().format("hh:mm:ss a");
    $(".date").text(currentDate);
    $(".time").text(currentTime);
    if (moment().second() === 0) {
        updateSchedule();
    }
};

// Interval to update the "clock" every second.
setInterval(updateStuff, 1000);

// Event handler and function for adding a train schedule to firebase.
$(".submit-button").on("click", function (event) {
    event.preventDefault();

    // get values from user input
    var trainName = $("#train-name").val().trim();
    var dest = $("#destination").val().trim();
    var firstTime = $("#first-time").val().trim();
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

    // Clears the input fields
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-time").val("");
    $("#frequency").val("");
});


// function for updating the schedule table.
function updateSchedule() {
    $("tbody").empty();

    // Event handler for when a new object is pushed to Firebase to update the html displayed on the page.
    database.ref().on("child_added", function (childSnapshot) {

        // Store everything as variables
        var trainName = childSnapshot.val().name;
        var dest = childSnapshot.val().dest;
        var firstTime = childSnapshot.val().firstTime;
        var freq = childSnapshot.val().freq;
        var nextArrive;
        var timeToArrival;

        /////// calculations:
        // take first time from 1 year ago to avoid problems if first time is after current time. 
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

        // Find the difference between the current time and the first time of the train.
        var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");

        // Modulo divide the timeDifference by the frequency to get a remainder, which is the amount 
        // of time "into the amount of time between trains."
        var timeRemainder = timeDifference % freq;


        // Find time until next train by subtracting the remainder above from the frequency, and set the variable.
        timeToArrival = freq - timeRemainder;

        // Calculate the next arrival time and set the variable.
        nextArrive = moment().add(timeToArrival, "minutes").format("hh:mm a");

        // Create a new table row with all the information as table data.
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(dest),
            $("<td>").text("Every " + freq + " min"),
            $("<td>").text(nextArrive),
            $("<td>").text(timeToArrival + " min"),
        );

        // Append the new row to the table's html
        $(".train-times > tbody").append(newRow);
    });
};

// Initial update of the schedule table on page load.
updateSchedule();