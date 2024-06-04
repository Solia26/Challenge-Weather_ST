const currentWeather = document.querySelector("#currentWeather")
console.log(currentWeather)
const forecastWeatherInfoRef = document.querySelector("#weather5days")
const searchContainer = document.getElementById("search-container")
const citiesNames = JSON.parse(localStorage.getItem("searchedCities")) || [];

const API_KEY = "5d990e1321f3770bde7e345a59ec56fe";

$("#submitBtn").on("click", function (e) {
  e.preventDefault();

  const cityName = $("#searchBar").val();
  

  $("#searchBar").val('');

  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
  )
    .then(function (res) {
      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
      return res.json();
    })
    .then(function (data) {
      if (data.length === 0) {
        throw new Error('No data found for the provided city name');
      }
      console.log(JSON.stringify(data));
      currentWeatherInfo(data[0].lat, data[0].lon, cityName);
      forecastWeatherInfo(data[0].lat, data[0].lon);
      saveToLocalStorage(cityName);
      citiesNames.push (cityName)
      if (!citiesNames.includes(cityName)) {searchContainer.insertAdjacentHTML("beforeend", `<button type="button">${cityName}</button>`)}
      // const savedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];
      // if (!savedCities.includes(cityName)) {
      //   savedCities.push(cityName);
      //   localStorage.setItem("searchedCities", JSON.stringify(savedCities));
      // }
      console.dir(searchContainer.childNodes)
      searchContainer.insertAdjacentHTML("beforeend", `<button type="button">${cityName}</button>`)
    })
    .catch(function (err) {
      console.log('Fetch error: ', err);
    });
});

function saveToLocalStorage(cityName) {
  const savedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];
  if (!savedCities.includes(cityName)) {
    savedCities.push(cityName);
    localStorage.setItem("searchedCities", JSON.stringify(savedCities));
  }
}



// function saveToLocalStorage(cityName) {

//     const savedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

//     savedCities.push(cityName)

//     localStorage.setItem("searchedCities", JSON.stringify(savedCities))

// }

function loadFromLocalStorage() {

    // get saved city
    const savedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

    for(city of savedCities) {
            // dynamic rendering /DOM
        const newButton = document.createElement("button");
        newButton.textContent = city;

        // add Event listener to newButton

        // <button>Edison</button>
        document.getElementById("search-container").append(newButton)
    }

}

function currentWeatherInfo(lat, lon, cityName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  )
    .then(function (res) { currentWeather.innerHTML=""
      return res.json();
    })
    .then(function (data) {
      console.log(JSON.stringify(data));

      const h2 = $("<h2>");
      h2.text(`${cityName} (${dayjs().format("MM/DD/YYYY")})`);

      const temp = $("<p>");
      temp.text(`Temp: ${data.main.temp}`);

      const wind = $("<p>");
      wind.text(`Wind Speed: ${data.wind.speed}`);
      
      $("#currentWeather").append(h2, temp, wind);
    })
    .catch(function (err) {
      console.log(err);
    });
}

function forecastWeatherInfo(lat, lon) {
    fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
      )
        .then(function (res) { forecastWeatherInfoRef.innerHTML=""
          return res.json();
        })
        .then(function (data) {
          console.log((data));
    const selectedData= [
        data.list[35], 
        data.list[27],
        data.list[19],
        data.list[11],
        data.list[3]
    ]
    console.log (selectedData)

    // <div class="weatherBox">
    //     <img src = "https://openweathermap.org/img/wn/10n@2x.png"/>
    //     <h3>04/20/2024 12:00:00</h3>
    //     <p>Temp: asdas</p>
    //     <p>Humidity: asdas</p>
    //     <p>Wind Speed: asdas</p>
    // </div>

    // loop

    for(forecastData of selectedData) {
        const weatherBoxDiv = document.createElement("div")
        weatherBoxDiv.classList.add("weatherBox")
    
        const dateH3 = document.createElement("h3")
        dateH3.textContent = forecastData.dt_txt;
    
        const tempP = document.createElement("p");
        tempP.textContent = "Temp: " + forecastData.main.temp;
    
        const humidityP = document.createElement("p")
        humidityP.textContent = "Humidity: " + forecastData.main.humidity;
    
        const windP = document.createElement("p")
        windP.textContent = "Wind Speed: " + forecastData.wind.speed;
    
        weatherBoxDiv.append(dateH3, tempP, humidityP, windP);
    
        document.getElementById("weather5days").append(weatherBoxDiv)
    }




    


        // //   const h2 = $("<h2>");
        //   h2.text(`${cityName} (${dayjs().format("MM/DD/YYYY")})`);
    
        //   const temp = $("<p>");
        //   temp.text(`Temp: ${data.main.temp}`);
    
        //   const wind = $("<p>");
        //   wind.text(`Wind Speed: ${data.wind.speed}`);
    
        // //   $("#currentWeather").append(h2, temp, wind);
        })
        .catch(function (err) {
          console.log(err);
        });
}




loadFromLocalStorage()



// for loop demo
// const colors = [
//     "blue",
//     "yellow",
//     "red"
// ]

// for(color of colors) {
//     console.log("I love " + color)
// }


// console.log("I love " + colors[0])
// console.log("I love " + colors[1])
// console.log("I love " + colors[2])