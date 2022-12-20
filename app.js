const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require('dotenv').config();
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});
app.post("/", function(req, res) {
  console.log(req.body.cityName);

  const query = req.body.cityName;
  const appKey = process.env.appKey;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appKey + "&units=" + unit;

  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const code = response.statusCode;
      const message = weatherData.message;
      if (code === 200) {
        const temp = weatherData.main.temp;
        const feelsLikeTemp = weatherData.main.feels_like
        const city = weatherData.name;
        const clouds = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@4x.png";
        console.log(iconUrl);
        console.log("The temperature in " + city + " is " + temp + "°C, feels like " + feelsLikeTemp + "°C, " + clouds)
        res.write("<h1> The weather in " + city + " is: </h1>")
        res.write("<h3>The temperature is " + temp + " degrees, feels like " + feelsLikeTemp + " degrees </h3>")
        res.write("<h3>" + clouds + "</h3>")
        res.write("<img src=" + iconUrl + "><br>")
        res.write("<button onclick="+ "history.back()" + ">Go Back</button>")
        res.send()
      } else {
        res.send("<h3>" + message + "</h3><br>" + "<button onclick="+ "history.back()" + ">Go Back and Try Again</button>")
      }
    });
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
