"use strict";

const LIMIT = 1;
let API_KEY = "";

fetch("env.json")
    .then(response => response.json())
    .then(env => {
      API_KEY = env.API_KEY;
    })
    .catch(error => {
      throw Error(`Error loading environment variables: ${error}`);
    })
    .finally(() => {
      if (!API_KEY) {
        throw Error("API_KEY is not defined");
      }
    });

document.addEventListener("DOMContentLoaded", () => {
  const getWeatherButton = document.getElementById("button-get-weather");
  getWeatherButton.addEventListener("click", () => {
    const cityInput = document.getElementById("input-city");
    const stateInput = document.getElementById("input-state");
    const countryInput = document.getElementById("input-country");

    if (!validateInputs(cityInput, stateInput, countryInput)) {
      cityInput.classList.add("validation-error");
      stateInput.classList.add("validation-error");
      countryInput.classList.add("validation-error");
      return;
    } else {
      cityInput.classList.remove("validation-error");
      stateInput.classList.remove("validation-error");
      countryInput.classList.remove("validation-error");
    }

    const params = {
      city: cityInput.value,
      state: stateInput.value,
      country: countryInput.value,
      limit: LIMIT,
      apiKey: API_KEY,
    };

    getGeocode(params);
  });
});

const buildGeoCodeUrl = (params) => {
  return `http://api.openweathermap.org/geo/1.0/direct?q=${params.city},${params.state},${params.country}&limit=${params.limit}&appid=${params.apiKey}`;
};

const getGeocode = (params) => {
  if (!params) {
    throw Error("Params is null");
  }

  const url = buildGeoCodeUrl(params);

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
};

const validateInputs = (cityInput, stateInput, countryInput) => {
  let valid = true;

  if (cityInput.value.trim().length === 0) {
    console.log("City is required.");
    valid = false;
  }

  if (stateInput.value.trim().length === 0) {
    console.log("State is required.");
    valid = false;
  }

  if (countryInput.value.trim().length === 0) {
    console.log("Country is required.");
    valid = false;
  }

  return valid;
};
