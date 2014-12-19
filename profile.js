'use strict';

var http = require('http');

//Convert API temp value from Kelvin to Celsius
function toCelsius(tempInK) {
    return Math.round(tempInK - 273.15);
}

//Convert wind direction to compass value
function windDirection(windDeg) {
    if (windDeg === 360 || windDeg === 0) { return "N"; }
    if (windDeg > 0 && windDeg < 90) { return "NE"; }
    if (windDeg === 90) { return "E"; }
    if (windDeg > 90 && windDeg < 180) { return "SE"; }
    if (windDeg === 180) { return "S"; }
    if (windDeg > 180 && windDeg < 270) { return "SW"; }
    if (windDeg === 270) { return "W"; }
    if (windDeg > 270 && windDeg < 360) { return "NW"; }
}

//Print message
function printMessage(loc, desc, temp, windSpeed, windDeg) {
    console.log("The current weather in " + loc + " is " + desc.toLowerCase() + " with a temperature of " + toCelsius(temp) + " degrees. The wind is coming from the " + windDirection(windDeg) + " at a speed of " + windSpeed + "mph.");
}

//Print out error messages
function printError(error) {
    console.error(error.message);
}

var body = "";

function get(location) {
    var request = http.get("http://api.openweathermap.org/data/2.5/weather?q=" + location, function (response) {
            response.on("data", function (chunk) {
                body += chunk;
            });
            response.on("end", function () {
                if (response.statusCode === 200) {
                    try {
                        var result = JSON.parse(body);
                        printMessage(location.split(',')[0], result.weather[0].main, result.main.temp, result.main.humidity, result.wind.speed, result.wind.deg);
                    } catch (error) {
                        printError(error);
                    }
                } else {
                    printError({message: "There was an error getting weather information for " + location + ". (" + http.STATUS_CODES[response.statusCode] + ")"});
                }
            });
        });
    request.on('error', printError);
}

module.exports.get = get;