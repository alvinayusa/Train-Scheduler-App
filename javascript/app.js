$(document).ready(function () {
    // ----- START of document.ready function -----

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyD7mUmUZ8SNL_JCA49plw9T4N2TO5rzfd0",
        authDomain: "traintimeapp-5f6e6.firebaseapp.com",
        databaseURL: "https://traintimeapp-5f6e6.firebaseio.com",
        projectId: "traintimeapp-5f6e6",
        storageBucket: "",
        messagingSenderId: "924646548140"
    };
    firebase.initializeApp(config);

    //Firebase Variable
    var database = firebase.database()

    // retrieve current time from moment.js
    var currentTime = moment()

    // write back current time to HTML (jumbotron's local time)
    $("#currentTime").text(currentTime)

    // submit button click function
    $("#submitBTN").on("click", function(){
        event.preventDefault()

        // create IDs for each form text input
        var train = $("#enterTrainNumber").val().trim()
        var destination = $("#enterDestination").val().trim()
        var firstTrain = $("#enterTrainTime").val().trim()
        var frequency = $("#enterFrequency").val().trim()
        

        // send data to Firebase
        database.ref().push({
            train: train,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            timeStamp: firebase.database.ServerValue.TIMESTAMP

        // END of .push to Firebase 
        })

    //END of submit button on click function 
    })

    // create a snapshot of each child record in firebase
    database.ref().on("child_added", function(childSnapshot){

        var train = childSnapshot.val().train
        var destination = childSnapshot.val().destination
        var firstTrain = childSnapshot.val().firstTrain
        var frequency = childSnapshot.val().frequency

        // console.log("Train: "+ train)
        // console.log("Destination: "+ destination)
        // console.log("First Train: "+ firstTrain)
        // console.log("Frequency: "+ frequency)

        // parse frequency into an integer and get back current time
        var frequency = parseInt(frequency)
        var currentTime = moment()
        
        // convert format of first train to military format
        // convert current time to military format
        var dateConvert = moment(childSnapshot.val().firstTrain, 'HH:mm').subtract(1, 'years')
        // console.log ("Date Converted: "+ dateConvert)

        var trainTime = moment(dateConvert).format('HH:mm')
        // console.log("Train Time: "+trainTime)

        // compute time difference between first train and current time
        var timeConverted = moment(trainTime, 'HH:mm').subtract(1, 'years')
        var timeDifference = moment().diff(moment(timeConverted), 'minutes')
        // console.log("Time Difference: " + timeDifference)

        // compute remainder using modulus %
        var timeRemaining = timeDifference % frequency
        console.log ("First Train Arrives: "+ timeRemaining)

        // calculate minutes until arrival
        var minutesUntilArrival = frequency - timeRemaining
        console.log ("Minutes Until Next Arrival: "+ minutesUntilArrival)

        // compute the minutes from the current time to get expected arrival time
        var firstTrain = moment().add(minutesUntilArrival, 'minutes')
        console.log ("Arrival Time: "+ moment(firstTrain).format('HH:mm'))

        // write back data into to the HTML table
        $("#trainTable").append(
            " <tr><td  id='trainNumberDisplay'> " + childSnapshot.val().train +
            " </td><td id='destinationDisplay'> " + childSnapshot.val().destination +
            " </td><td id='frequencyDisplay'> " + childSnapshot.val().frequency +
            " </td><td id='nextTrainDisplay'> " + moment(firstTrain).format("HH:mm") +
            " </td><td id='minutesUntilArrivalDisplay'> " + minutesUntilArrival + ' Minutes Until Arrival'
        )

        // function (errorObject) {
        //     console.log("Read failed: " + errorObject.code)

    //END of child record snapshot to firebase 
    })


    //END of document.ready 
})