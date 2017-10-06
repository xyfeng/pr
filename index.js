// FlightAware API
var Client = require('node-rest-client').Client;
var username = 'xyf';
var apiKey = 'f34d7ed75ceabfaf9f79089d875d667e96ba7c49';
var fxmlUrl = 'https://flightxml.flightaware.com/json/FlightXML3/'
var client_options = {
  user: username,
  password: apiKey
};
var client = new Client(client_options);
client.registerMethod('findFlights', fxmlUrl + 'AirlineFlightSchedules', 'GET');
// airport codes
var fs = require("fs");
var moment = require("moment");
var FlightDesignator = require('flight-designator');
var airports = JSON.parse(fs.readFileSync("airports.json"));
var airlines = JSON.parse(fs.readFileSync("airlines.json"));

function getScheduledFlights(code, callback) {
  var now = new Date();
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
  var endOfDay = startOfDay + 86400;
  var findFlightArgs = {
    parameters: {
      start_date: startOfDay,
      end_date: endOfDay,
      destination: code,
      howMany: 1000
    }
  };
  client.methods.findFlights(findFlightArgs, function(data, response) {
    callback(data);
  });
}

// TWILIO
var Twilio = require('twilio');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var accountSid = 'AC2cd1a37754580fab762048d570fc4018';
var authToken = 'c97d63fc16c40b563037b243a0e69a52';
var twilio = new Twilio(accountSid, authToken);
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

http.createServer(app).listen(8080, function() {
  console.log("Express server listening on port 8080");
});

app.post('/', function(req, res) {
  // console.log(JSON.stringify(req.body));
  var code = req.body.Body;
  var fromPhone = req.body.From;
  var toPhone = req.body.To;
  getScheduledFlights(code, function(data){
    // console.log(JSON.stringify(data));
    var flights = data.AirlineFlightSchedulesResult.flights;
    var msg = parseFlights(flights);
    twilio.messages.create({
        body: msg,
        to: fromPhone,
        from: toPhone
      })
      .then((message) => console.log(message.sid));
  });
});

function getAirlineName(code) {
  for( var key in airlines) {
    var one = airlines[key];
    if( one.ICAO === code ){
      return one.name;
    }
  }
  return null;
}

function parseFlights(data) {
  var result = '\n';
  for( var one of data ) {
    if( 'fa_ident' in one ) {
      var origin = airports[one.origin].iata;
      var destination = airports[one.destination].iata;
      var flightData = FlightDesignator.parse(one.ident);
      var airlineCode = flightData.airlineCode;
      var airlineName = getAirlineName(airlineCode);
      var flightNumber = flightData.flightNumber;
      var departure = moment( new Date(one.departuretime * 1000) ).format('LT');
      var arrival = moment( new Date(one.arrivaltime * 1000) ).format('LT');
      result += airlineCode + ' ' + flightNumber + ' ' + origin + '->' + destination + ' ' + departure + ' ' + 'to' + ' ' + arrival + '\n';
    }
  }
  return result;
}
