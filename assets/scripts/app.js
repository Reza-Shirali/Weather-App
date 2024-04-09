import { getWeekDay } from "../utils/customDate.js";
import { getWeatherData } from "../utils/httpReq.js";
import { showModal } from "../utils/modal.js";

const inputCity = document.querySelector(".input__city");
const searchBtn = document.querySelector(".search__btn");
const weatherContainer = document.querySelector(".weather");
const locationIcon = document.querySelector(".location");
const forecastContainer = document.querySelector(".forecast");

const renderCurrentWeather = (data) => {
  if (!data) return;

  const weatherJSX = `
    <h1 class="title__weather">${data.name},${data.sys.country}</h1>
    <div class="main">
        <img alt="weather icon" src="https://openweathermap.org/img/wn/${
          data.weather[0].icon
        }.png"/>
        <span class="weather__main">${data.weather[0].main}</span>
        <span class="weather__temp">${Math.round(data.main.temp)}°C</span>
    </div>
    <div class="info">
        <p class="info__humidity">Humidity: <span>${
          data.main.humidity
        } %</span></p>
        <p class="info__wind">Wind speed: <span>${
          data.wind.speed
        } m/s</span></p>
    </div>
  `;

  weatherContainer.innerHTML = weatherJSX;
};

const renderForecastWeather = (data) => {
  if (!data) return;
  forecastContainer.innerHTML = "";
  data = data.list.filter((item) => item.dt_txt.includes("12:00:00"));
  data.forEach((item) => {
    const forecastJSX = `
      <div class="card__forecast">
        <img alt="weather icon" src="https://openweathermap.org/img/wn/${
          item.weather[0].icon
        }.png"/>
        <h3 class="forecast__day">${getWeekDay(item.dt)}</h3>
        <p class="forecast__temp">${Math.round(item.main.temp)}°C</p>
        <span class="forecast__main">${item.weather[0].main}</span>
      </div>
    `;
    forecastContainer.innerHTML += forecastJSX;
  });
};

const searchHandler = async () => {
  const cityName = inputCity.value;

  if (!cityName) {
    showModal("Please enter a city name");
    return;
  }

  const currentData = await getWeatherData("current", cityName);
  renderCurrentWeather(currentData);

  const forecastData = await getWeatherData("forecast", cityName);
  renderForecastWeather(forecastData);
};

const positionCallback = async (position) => {
  const currentData = await getWeatherData("current", position.coords);
  const forecastDataLocation = await getWeatherData(
    "forecast",
    position.coords
  );
  renderCurrentWeather(currentData);
  renderForecastWeather(forecastDataLocation);
};

const errorCallback = (error) => {
  showModal(error.message);
};

const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    showModal("Your browser does not support geolocation");
  }
};

const initHandler = async () => {
  const currentData = await getWeatherData("current", "Tehran");
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", "Tehran");
  renderForecastWeather(forecastData);
};

searchBtn.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
document.addEventListener("DOMContentLoaded", initHandler);
