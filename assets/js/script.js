var cityInput = document.getElementById("city-input");
var city = document.getElementById("city");
var serch = document.getElementById("serch");
var serchForm = document.getElementById("inputForm");
var temp = document.getElementById("temp");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var uv = document.getElementById("uv");
var fiveDayData = [];
var citys = []
var tempDate = new Date()
var today = " " + tempDate.getDate() + "/" + tempDate.getMonth() + "/" + tempDate.getFullYear() + " ";


serchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    citys.push(cityInput.value);
    localStorage.setItem('citys', JSON.stringify(citys));
    oneday();
    console.log(citys);
    displayCity();

    document.getElementById("clc").addEventListener("click", function(event) {
        document.getElementById("city-input").value = event.target.textContent;
        oneday();
    })



});

// get five day forcast
function fiveDay(lat, lon) {

    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,minutely&units=imperial&appid=0300d1098792a74c4fd86df727631b1d'
    console.log(apiUrl);
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data.current.weather[0].description);
                    uv.textContent = data.current.uvi;
                    fiveDayData = data;
                    fiveDaysElements();
                })
            }

        })


}

// get one day forcast
function oneday() {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInput.value + '&units=imperial&appid=0300d1098792a74c4fd86df727631b1d'
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {

                    temp.textContent = data.main.temp;
                    wind.textContent = data.wind.speed;

                    var dayimg = data.weather[0].icon;
                    var src = "http://openweathermap.org/img/wn/" + dayimg + "@2x.png"
                    document.getElementById("img").setAttribute("src", "http://openweathermap.org/img/wn/" + dayimg + "@2x.png")
                        //  city.textContent = cityInput.value + today + data.weather[0].main;
                    document.getElementById("city").textContent = cityInput.value;
                    document.getElementById("date").textContent = " (" + today + ")"

                    humidity.textContent = data.main.humidity;
                    var lon = data.coord.lon;
                    var lat = data.coord.lat;
                    console.log("lon:" + lon + "lat:" + lat)
                    document.getElementById("right").setAttribute("style", "display: block")
                    fiveDay(lat, lon);

                })

            } else {
                citys.pop();
                localStorage.setItem('citys', JSON.stringify(citys));
                displayCity();
                window.alert("Invalid city")

            }
        })

}



function fiveDaysElements() {
    var right = document.getElementById("right");
    if (document.getElementById("days") != null) {
        right.removeChild(document.getElementById("days"))
    }
    var daysContainer = document.createElement("div");
    daysContainer.className = "fiveDaysContainer d-flex flex-wrap";
    daysContainer.setAttribute("id", "days");
    right.appendChild(daysContainer);

    for (i = 1; i < 6; i++) {


        var dayContainer = document.createElement("div");
        var sDate = document.createElement("div");
        var sign = document.createElement("img");
        var sTemp = document.createElement("div");
        var sWind = document.createElement("div");
        var Shumidity = document.createElement("div");



        dayContainer.className = "smallContainer flex-grow-1";

        // coverting date do reade able date
        var tempDate = new Date(fiveDayData.daily[i].dt * 1000);
        sDate.textContent = tempDate.getMonth() + "/" + tempDate.getDate() + "/" + tempDate.getFullYear();

        // set weather icon 
        var img = fiveDayData.daily[i].weather[0].icon;
        sign.setAttribute("src", "http://openweathermap.org/img/wn/" + img + "@2x.png")


        sTemp.innerHTML = "Temp: &nbsp;" + fiveDayData.daily[i].temp.day + "&nbsp; F";
        sWind.innerHTML = "Wind: &nbsp;" + fiveDayData.daily[i].wind_speed + "MPH";
        Shumidity.innerHTML = "Humidity: &nbsp" + fiveDayData.daily[i].humidity + "&nbsp %";



        dayContainer.appendChild(sDate);
        dayContainer.appendChild(sign);
        dayContainer.appendChild(sTemp);
        dayContainer.appendChild(sWind);
        dayContainer.appendChild(Shumidity);

        daysContainer.appendChild(dayContainer);
    }


}

function displayCity() {
    var left = document.getElementById("left");
    if (document.getElementById("clc") != null) {
        left.removeChild(document.getElementById("clc"));
    }
    var cityLogContainer = document.createElement("div");
    cityLogContainer.setAttribute("id", "clc")
    left.appendChild(cityLogContainer);
    for (i = 0; i < citys.length; i++) {

        var cityLog = document.createElement("button");
        cityLog.textContent = citys[i];
        cityLog.className = "my-3"

        cityLogContainer.appendChild(cityLog);
    }



}


// storing citys in local storage
if (localStorage.getItem("citys")) {
    citys = JSON.parse(localStorage.getItem("citys"))
    displayCity();


}

// conect saved cites to search
if (document.getElementById("clc") != null) {
    document.getElementById("clc").addEventListener("click", function(event) {
        document.getElementById("city-input").value = event.target.textContent;
        oneday();
    })
}


document.getElementById("right").setAttribute("style", "display: none")