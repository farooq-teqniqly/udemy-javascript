"use strict";

const LIMIT = 1;
let API_KEY = "";

const apiErrorsEl = document.getElementById("api-errors");
apiErrorsEl.replaceChildren();

fetch("env.json")
  .then((response) => response.json())
  .then((env) => {
    API_KEY = env.API_KEY;
  })
  .catch((error) => {
    appendApiError(apiErrorsEl, "Could not get weather from weather service.");
    console.error(`Error loading environment variables: ${error}`);
  })
  .finally(() => {
    if (!API_KEY) {
      appendApiError(
        apiErrorsEl,
        "Could not get weather from weather service.",
      );
      console.error("API_KEY is not defined");
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  const getWeatherButton = document.getElementById("button-get-weather");

  getWeatherButton.addEventListener("click", () => {
    const validationErrorsEl = document.getElementById("validation-errors");
    validationErrorsEl.replaceChildren();

    const inputs = {
      city: document.getElementById("input-city"),
      state: document.getElementById("input-state"),
      country: document.getElementById("input-country"),
    };

    const validationErrors = validateInputs(inputs);

    if (validationErrors.length > 0) {
      validationErrors.forEach((e) => {
        const p = document.createElement("p");
        p.textContent = e;
        validationErrorsEl.appendChild(p);
      });

      return;
    }

    const params = {
      city: inputs["city"].value,
      state: inputs["state"].value,
      country: inputs["country"].value,
      limit: LIMIT,
      apiKey: API_KEY,
    };

    getGeocode(params).then((data) => {
      console.log(data);
    });
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

  return fetch(url)
    .then((res) => {
      if (res.status !== 200) {
        appendApiError(
          apiErrorsEl,
          `Could not get weather from weather service. Error: ${res.statusText}`,
        );
        console.error(res);
        return;
      }

      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      appendApiError(
        apiErrorsEl,
        `Could not get weather from weather service. Error: ${error}`,
      );
      console.error(error);
    });
};

const validateInputs = (inputs) => {
  const errors = [];

  for (let key in inputs) {
    if (inputs[key].value.trim().length === 0) {
      errors.push(inputs[key].getAttribute("placeholder"));
    }
  }

  return errors;
};

const appendApiError = (apiErrorsEl, errorMessage) => {
  const p = document.createElement("p");
  p.textContent = errorMessage;
  p.classList.add("api-error");
  apiErrorsEl.appendChild(p);
};
