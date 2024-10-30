"use strict";

const LIMIT = 1;
let API_KEY = "";

fetch("env.json")
  .then((response) => response.json())
  .then((env) => {
    API_KEY = env.API_KEY;
  })
  .catch((error) => {
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
    const validationErrors = document.getElementById("validation-errors");

    validationErrors.replaceChildren();

    if (cityInput.value.trim().length === 0) {
      const p = document.createElement("p");
      p.textContent = cityInput.getAttribute("placeholder");
      validationErrors.appendChild(p);
    }

    if (stateInput.value.trim().length === 0) {
      const p = document.createElement("p");
      p.textContent = stateInput.getAttribute("placeholder");
      validationErrors.appendChild(p);
    }

    if (countryInput.value.trim().length === 0) {
      const p = document.createElement("p");
      p.textContent = countryInput.getAttribute("placeholder");
      validationErrors.appendChild(p);
    }

    if (validationErrors.hasChildNodes()) {
      return;
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

const validateInputs = (inputElement) => {
  if (inputElement.value.trim().length === 0) {
    inputElement.classList.remove("validation-error");
    inputElement.classList.add("validation-error");
  } else {
    inputElement.classList.remove("validation-error");
  }
};

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
