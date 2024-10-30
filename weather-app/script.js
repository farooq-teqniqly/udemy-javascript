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
    const validationErrors = document.getElementById("validation-errors");
    validationErrors.replaceChildren();

    const inputs = {
      city: document.getElementById("input-city"),
      state: document.getElementById("input-state"),
      country: document.getElementById("input-country"),
    };

    for (let key in inputs) {
      if (inputs[key].value.trim().length === 0) {
        const p = document.createElement("p");
        p.textContent = inputs[key].getAttribute("placeholder");
        validationErrors.appendChild(p);
      }
    }

    if (validationErrors.hasChildNodes()) {
      return;
    }

    const params = {
      city: inputs["city"].value,
      state: inputs["state"].value,
      country: inputs["country"].value,
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
