var firebaseConfig = {
  apiKey: "AIzaSyAbZAnLT0euIx46dbLWB4nPJ0AeVgAJPPU",
  authDomain: "classtest-adfcd.firebaseapp.com",
  databaseURL: "https://classtest-adfcd.firebaseio.com",
  projectId: "classtest-adfcd",
  storageBucket: "",
  messagingSenderId: "575175921291",
  appId: "1:575175921291:web:8490efae963aab38"
};
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$("form").on("submit", function (event) {
  event.preventDefault()
  var trainName = $("#trainNameInput").val().trim();
  var destination = $("#destinationInput").val().trim();
  var firstTrainTime = $("#firstTrainInput").val().trim();
  var frequency = $("#frequencyInput").val().trim();
  if(firstTrainTime === ""|| frequency === ""){
    alert("Please make sure First train time and Frequency are numeric values")
  }else{
  database.ref().push({
    trainName,
    destination,
    firstTrainTime,
    frequency
    })
  }

});
// listener for database changes
database.ref().on("child_added", function (snapshot) {
  var tempTrainObject = {
    name: snapshot.val().trainName,
    destination: snapshot.val().destination,
    firstTrainTime: snapshot.val().firstTrainTime,
    frequency: snapshot.val().frequency,
  }
  var firstTrainTimeArr = tempTrainObject.firstTrainTime.split(":")
  var firstTrainTime = moment().hours(firstTrainTimeArr[0]).minutes(firstTrainTimeArr[1])
  var currentTime = moment()
  var furthestTrainTime = moment.max(currentTime,firstTrainTime)

  var minTilTrain ;
  var trueArrivalTime ;

  if(furthestTrainTime === firstTrainTime){
    minTilTrain = firstTrainTime.diff(moment(),"minutes")
    trueArrivalTime = firstTrainTime.format("hh:mm A")
  }else{
    var minutesDifference = moment().diff(firstTrainTime,"minutes")
    minTilTrain = tempTrainObject.frequency - (minutesDifference % tempTrainObject.frequency)
    trueArrivalTime = moment().add(minTilTrain,"m").format("hh:mm A")
  }

  console.log(minTilTrain)
  console.log(trueArrivalTime)
  
  var tr = $("<tr>");
  var tdName = $("<td>").text(tempTrainObject.name)
  var tdDestination = $("<td>").text(tempTrainObject.destination)
  var tdFrequency = $("<td>").text(tempTrainObject.frequency)
  var tdArrival = $("<td>").text(trueArrivalTime)
  var tdMinutesAway = $("<td>").text(minTilTrain)

  tr.append(tdName,tdDestination,tdFrequency,tdArrival,tdMinutesAway)

  $("tbody").append(tr)





})






    // console.log(moment().format("HH:mm"))
