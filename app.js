const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require('dotenv').config();
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', function (req, res) {
  res.render("index");
});

app.post("/", function(req, res) {

  const query = req.body.cityName;
  const appKey = process.env.appKey;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appKey + "&units=" + unit;

  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const code = response.statusCode;
      if (code === 200) {
        const temp = weatherData.main.temp;
        const feelsLikeTemp = weatherData.main.feels_like
        const city = weatherData.name;
        const clouds = weatherData.weather[0].description;
        let weatherResult = "The temperature in " + city + " is " + temp + "°C, feels like " + feelsLikeTemp + "°C, " + clouds +  ".";
        console.log(weatherResult);
        res.render("result", {newWeatherResult: weatherResult})
            } else {
        res.render("result", {newWeatherResult: "This city doesn't exist =(("});
      }
    });
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
