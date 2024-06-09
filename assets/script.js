const currentWeather = document.querySelector("#currentWeather");
const forecastWeatherInfoRef = document.querySelector("#weather5days");
const searchContainer = document.getElementById("CitiesList");
const weatherForm = document.querySelector("#weatherForm");
const clearHistoryBtn = document.querySelector("#clear-history");

const API_KEY = "5d990e1321f3770bde7e345a59ec56fe";
loadFromLocalStorage();
searchContainer.addEventListener("click", showWetaherHistory);

clearHistoryBtn.addEventListener("click", () => {
  searchContainer.innerHTML = "";
  localStorage.removeItem("searchedCities");
});

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const cityName = e.target.elements.searchBar.value.trim();
  serachAndPasteWeather(cityName, API_KEY);
  e.currentTarget.reset();
});

// $("#submitBtn").on("click", function (e) {
//   e.preventDefault();

//   const cityName = $("#searchBar").val();

//   serachAndPasteWeather(cityName, API_KEY);
//   $("#searchBar").val("");
// });

function saveToLocalStorage(cityName) {
  const savedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];
  if (!savedCities.includes(cityName)) {
    savedCities.push(cityName);
    localStorage.setItem("searchedCities", JSON.stringify(savedCities));
    searchContainer.insertAdjacentHTML(
      "beforeend",
      `<button type="button">${cityName}</button>`
    );
  }
}

function loadFromLocalStorage() {
  const savedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];
  const buttonHistory = [];
  for (city of savedCities) {
    buttonHistory.push(`<button>${city}</button>`);
  }
  searchContainer.insertAdjacentHTML("beforeend", buttonHistory.join(""));
}

function currentWeatherInfo(lat, lon, cityName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  )
    .then(function (res) {
      currentWeather.innerHTML = "";
      return res.json();
    })
    .then(function (data) {
      console.log("😎 ~ data:", data);
      const marcup = `
      <div>
        <h2>
          ${cityName}
          <span>${dayjs().format("MM/DD/YYYY")}</span>
        </h2>
        <img
          src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png"
          alt="Weather Icon"
        />
      </div>
      <p>Temp: ${data.main.temp}</p>
      <p>Wind Speed: ${data.wind.speed}</p>`;

      currentWeather.insertAdjacentHTML("beforeend", marcup);
    })
    .catch(function (err) {
      console.log(err);
    });
}

function forecastWeatherInfo(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      forecastWeatherInfoRef.innerHTML = "";
      const selectedData = [
        data.list[3],
        data.list[11],
        data.list[19],
        data.list[27],
        data.list[35],
      ];
      const marcupData = [];
      for (forecastData of selectedData) {
        const dateString = forecastData.dt_txt.slice(0, 10);
        const [year, month, day] = dateString.split("-");
        const upgradeDate = `${month}/${day}/${year}`;

        marcupData.push(`<div class="weatherBox">
            <h3>${upgradeDate}</h3>
            <img
              src="http://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png"
              alt="Weather Icon"
            />
            <p>Temp: ${forecastData.main.temp} &#176;F</p>
            <p>Humidity: ${forecastData.main.humidity} <span>MPH</span></p>
            <p>Wind Speed: ${forecastData.wind.speed} %</p>
          </div>`);
      }
      forecastWeatherInfoRef.insertAdjacentHTML(
        "beforeend",
        marcupData.join("")
      );
    })
    .catch(function (err) {
      console.log(err);
    });
}



function showWetaherHistory(event) {
  const btnElem = event.target;
  if (!btnElem.nodeName === "BUTTON") return;
  const cityName = btnElem.textContent;
  serachAndPasteWeather(cityName, API_KEY);
}

function serachAndPasteWeather(cityName, API_KEY) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
  )
    .then(function (res) {
      if (!res.ok) {
        throw new Error("Network response was not ok " + res.statusText);
      }
      return res.json();
    })
    .then(function (data) {
      if (data.length === 0) {
        throw new Error("No data found for the provided city name");
      }
      currentWeatherInfo(data[0].lat, data[0].lon, cityName);
      forecastWeatherInfo(data[0].lat, data[0].lon);
      saveToLocalStorage(cityName);
    })
    .catch(function (err) {
      console.log("Fetch error: ", err);
    });
}
