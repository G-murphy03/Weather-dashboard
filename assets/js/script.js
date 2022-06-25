
var date = moment().format("dddd, MMMM, Do, YYYY");
var dateTime = moment().format("YYYY-MM-DD HH:MM:SS");
var cardInfo = $('.today-info');
var city = "Sydney";
var key = "d332c011d69ce2ab0548271b8a1515d6";

function getWeatherToday() {
    var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}';
    $(cardInfo).empty();

    fetch(requestURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                })
            }
        }
    )}