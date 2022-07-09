
var date = moment().format("dddd, MMMM, Do, YYYY");
var dateTime = moment().format("YYYY-MM-DD HH:MM:SS");
var cardInfo = $('.today-info');
var city = "Sydney";
var key = "d332c011d69ce2ab0548271b8a1515d6";
var fiveDayForecast = $('.5day-forecast');
var previousCityContainer = $('.city-list');

function getWeatherToday() {
    var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
    fetch(requestURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayWeather(data);
                })
            }
        }
    )}

function displayWeather(data) {
    $('.city-name').text(data.name);
    $('.date').text(date);
    $('.weather-icon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
    $('#temperature').text('Temperature: ' + data.main.temp + '°C');
    $('#wind').text('Wind: ' + data.wind.speed + ' KPH');
    $('#humidity').text('Humidity: ' + data.main.humidity + ' %');
    $('#humidity').text('Humidity: ' + data.main.humidity + ' %');
    var longitude = data.coord.lon;
    var latitude = data.coord.lat;

    var uvIndexURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,daily,minutely&appid=${key}`;
    fetch(uvIndexURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    uvIndexDisplay(data);
                })
            }
        })
}

function uvIndexDisplay(data) {
    $('#UV').text('UV Index: ');
    var uvIndexSpan = $('<span>')
    uvIndexSpan.text(data.current.uvi);
    $('#UV').append(uvIndexSpan);
    console.log(data.current.uvi);
    if (data.current.uvi >= 0 && data.current.uvi <= 3) {
        uvIndexSpan.attr('class', 'favourable');
    } else if (data.current.uvi > 3 && data.current.uvi <= 6) {
        uvIndexSpan.attr('class', 'moderate');
    } else (data.current.uvi > 6 && data.current.uvi <= 9) 
        uvIndexSpan.attr('class', 'severe');
    
    getFiveDayForecast();
}

function getFiveDayForecast() {
    var FiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${key}`;

    fetch(FiveDayURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayFiveDayForecast(data);
                })
            }
        })
}

function displayFiveDayForecast(data) {
    var dayOne = data.list[0];
    var dayTwo = data.list[7];
    var dayThree = data.list[14];
    var dayFour = data.list[21];
    var dayFive = data.list[28];
    var fiveDayArray = [dayOne, dayTwo, dayThree, dayFour, dayFive];
    fiveDayArray.forEach(function(forecast){
        var fiveDayDiv = $('<div>');
        fiveDayDiv.attr('class', 'col-md-3 card')
        fiveDayForecast.append(fiveDayDiv);

        var fiveDayDivHeader = $('<h1>');
        fiveDayDivHeader.attr('class', 'five-day-header');
        date = forecast.dt_txt.split(' ')[0]
        fiveDayDivHeader.text(moment(date).format('DD-MM-YYYY'));
        fiveDayDiv.append(fiveDayDivHeader);

        var fiveDayDivBody = $('<div>');
        fiveDayDivBody.attr('class', 'five-day-body');
        fiveDayDiv.append(fiveDayDivBody);

        var fiveDayDivIcon = $('<img>');
        fiveDayDivIcon.attr('src', `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`);
        fiveDayDivIcon.attr('class', 'weather-icon');
        fiveDayDivBody.append(fiveDayDivIcon);


        var tempText = $('<p>').text('Temperature: ' + forecast.main.temp + '°C');
        fiveDayDivBody.append(tempText);

        var windText = $('<p>').text('Wind: ' + forecast.wind.speed + ' KPH');
        fiveDayDivBody.append(windText);

        var humidityText = $('<p>').text('Humidity: ' + forecast.main.humidity + ' %');
        fiveDayDivBody.append(humidityText);
    });
}

previousCitySearch = [];

$('.search').on('click', function(event){
    event.preventDefault();
    city = $(this).siblings('.input').val().trim();
    previousCitySearch.push(city);

    localStorage.setItem('city', JSON.stringify(previousCitySearch));
    fiveDayForecast.empty();
    previousCities();
    getWeatherToday();
})

function previousCities() {
    previousCityContainer.empty();
    for(i=0; i<previousCitySearch.length; i++){
        var citybtn = $('<button>').text(previousCitySearch[i]);
        citybtn.attr('class', 'btn btn-info searchbtn')
        previousCityContainer.append(citybtn);
    }

    $('.searchbtn').on('click', function(event){
        event.preventDefault();
        city = $(this).text();
        fiveDayForecast.empty();
        getWeatherToday();
    });
}

function preload() {
    var cityStorage = JSON.parse(localStorage.getItem('city'));
    if (cityStorage !== null){
        previousCitySearch = cityStorage
    }
    previousCities();
    getWeatherToday();
}

preload();