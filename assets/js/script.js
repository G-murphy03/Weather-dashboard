
var date = moment().format("DD/MM/YYYY");
var dateTime = moment().format("YYYY-MM-DD HH:MM:SS");
var cardInfo = $('.today-info');
var city = "Sydney";
var key = "d332c011d69ce2ab0548271b8a1515d6";
var fiveDayForecast = $('.5day-forecast');
var previousCityContainer = $('.city-list');
var textInput = document.querySelector('.input');

// fetches weather data from current day
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

// displays fetched weather data from current day into weather-display class
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

    // fetching to get UV index data
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

// displays fetched UV index data to display with colours corresponding to conditions of UV index
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
    } else {
        uvIndexSpan.attr('class', 'severe');
    } 
    getFiveDayForecast();
}

// fetches five day forecast data
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

// displays fetched five day forecast data into separate cards for each day
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

        var fiveDayDivHeader = $('<h3>');
        fiveDayDivHeader.attr('class', 'five-day-header');
        date = forecast.dt_txt.split(' ')[0]
        fiveDayDivHeader.text(moment(date).format('DD/MM/YYYY'));
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

var previousCitySearch = [];

// eventlistener for click on the search button to run a function that pushes the search into an array for local storage
$('.search').on('click', function(event){
    event.preventDefault();
    city = $(this).siblings('.input').val().trim();
    if(city===''){
        return;
    }
    previousCitySearch.push(city);
    localStorage.setItem('city', JSON.stringify(previousCitySearch));
    fiveDayForecast.empty();
    previousCities();
    getWeatherToday();
    textInput.value = '';
})

// creates buttons based off previous city searches and adds an event listener so when button is clicked, the specific cities weather is again displayed
function previousCities() {
    previousCityContainer.empty();
    for(i=0; i<previousCitySearch.length; i++){
        var citybtn = $('<button>').text(previousCitySearch[i]);
        citybtn.attr('class', 'btn btn-info searchbtn');
        previousCityContainer.append(citybtn);
    }

    $('.searchbtn').on('click', function(event){
        event.preventDefault();
        city = $(this).text();
        fiveDayForecast.empty();
        getWeatherToday();
    });
}

// function for when the page is loaded to load local storage if there is content in the previousCitySearch array
function preload() {
    var cityStorage = JSON.parse(localStorage.getItem('city'));
    if (cityStorage !== null){
        previousCitySearch = cityStorage
    }
    previousCities();
    getWeatherToday();
}

preload();

// function to clear past city searches and local storage when the clear button is clicked  
function clearHistory(event) {
    event.preventDefault();
    $('.city-list').empty();
    localStorage.clear();
    previousCitySearch = []

}

$('.clear').on('click', clearHistory);