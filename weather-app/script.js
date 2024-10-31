"use strict";

const LIMIT = 1;
let API_KEY = "";

const apiErrorsEl = document.getElementById("api-errors");
apiErrorsEl.replaceChildren();

const COULD_NOT_GET_WEATHER_FROM_SERVICE =
  "Could not get weather from weather service.";

fetch("env.json")
  .then((response) => response.json())
  .then((env) => {
    API_KEY = env.API_KEY;
  })
  .catch((error) => {
    appendApiError(apiErrorsEl, COULD_NOT_GET_WEATHER_FROM_SERVICE);
    console.error(`Error loading environment variables: ${error}`);
  })
  .finally(() => {
    if (!API_KEY) {
      appendApiError(apiErrorsEl, COULD_NOT_GET_WEATHER_FROM_SERVICE);
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

    getGeocode(params)
      .then((geocodeData) => {
        displayGeocodeData(geocodeData[0]);

        const weatherParams = {
          lat: geocodeData[0]["lat"],
          lon: geocodeData[0]["lon"],
          units: "imperial",
          appId: API_KEY,
        };

        return getWeather(weatherParams);
      })
      .then((weatherData) => {
        console.log(weatherData);
        displayWeatherData(weatherData);
      })
      .catch((error) => {
        appendApiError(
          apiErrorsEl,
          `Could not get weather from weather service. Error: ${error}`,
        );
      });
  });
});

/**
 * Constructs a URL for the OpenWeatherMap Geocoding API.
 *
 * @param {Object} params - The parameters for the API request.
 * @param {string} params.city - The name of the city.
 * @param {string} [params.state] - The name of the state (optional).
 * @param {string} params.country - The name of the country.
 * @param {number} params.limit - The maximum number of results to return.
 * @param {string} params.apiKey - The API key for authenticating the request.
 * @returns {string} The constructed URL for the Geocoding API request.
 */
const buildGeoCodeUrl = (params) => {
  return `http://localhost:4000/geo/1.0/direct?q=${params.city},${params.state},${params.country}&limit=${params.limit}&appid=${params.apiKey}`;
};

/**
 * Fetches geocode data based on the provided parameters.
 *
 * @param {Object} params - The parameters to build the geocode request URL.
 * @throws Will throw an error if params is null or the fetch request fails.
 * @returns {Promise<Object>} A promise that resolves to the geocode data in JSON format.
 */
const getGeocode = (params) => {
  if (!params) {
    throw Error("Params is null");
  }

  const url = buildGeoCodeUrl(params);

  return fetchUrl(url);
};

/**
 * Fetches data from a given URL and returns a JSON response.
 *
 * This function performs an HTTP GET request to the specified URL,
 * checks for a successful response status (200), and then returns
 * the JSON-parsed data. If the response status is not 200 or if
 * any other error occurs, an error is thrown and logged to the console.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<object>} A promise that resolves to the JSON-parsed response data.
 * @throws {Error} If the request fails or the response status is not 200.
 */
const fetchUrl = (url) => {
  return fetch(url)
    .then((res) => {
      if (res.status !== 200) {
        console.error(res);
        throw new Error(
          `Could not get weather from weather service. Error: ${res.statusText}`,
        );
      }

      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });
};

const buildWeatherUrl = (params) => {
  return `http://localhost:4001/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&units=${params.units}&appid=${params.appId}`;
};

/**
 * Fetches weather data from a weather service.
 *
 * @param {Object} params - The parameters required to build the weather URL.
 * @throws Will throw an error if `params` is null.
 * @throws Will throw an error if the response status is not 200.
 * @returns {Promise<Object>} - A promise that resolves to weather data in JSON format.
 */
const getWeather = (params) => {
  if (!params) {
    throw Error("Params is null");
  }

  const url = buildWeatherUrl(params);

  return fetchUrl(url);
};

/**
 * Validates a set of input fields to check for any empty values.
 *
 * This function iterates through each input in the provided inputs object
 * and checks if the value is an empty string after trimming whitespace.
 * If an input is found to be empty, its placeholder attribute is added to
 * the errors array.
 *
 * @param {Object} inputs - An object where each key is an identifier for
 * an input field, and the value is an input element with at least
 * the properties `value` and `getAttribute`.
 *
 * @returns {Array<string>} An array of placeholder strings corresponding
 * to input fields that have empty values.
 */
const validateInputs = (inputs) => {
  const errors = [];

  for (let key in inputs) {
    if (inputs[key].value.trim().length === 0) {
      errors.push(inputs[key].getAttribute("placeholder"));
    }
  }

  return errors;
};

/**
 * Appends an API error message to the specified DOM element.
 *
 * @param {HTMLElement} apiErrorsEl - The DOM element to which the error message will be appended.
 * @param {string} errorMessage - The error message text to display.
 */
const appendApiError = (apiErrorsEl, errorMessage) => {
  const p = document.createElement("p");
  p.textContent = errorMessage;
  p.classList.add("api-error");
  apiErrorsEl.appendChild(p);
};

/**
 * Displays geocode data by updating the DOM element with geocode information.
 * Logs the provided data to the console.
 * Throws an error if the provided data is undefined.
 * Retrieves the 'geocode-information' element from the DOM, clears its children,
 * and updates it with location details including coordinates if they are valid numbers.
 *
 * @param {Object} data - The geocode data to display.
 * @param {string} data.lat - The latitude of the location.
 * @param {string} data.lon - The longitude of the location.
 * @param {string} data.name - The name of the location.
 * @param {string} data.state - The state of the location.
 * @param {string} data.country - The country of the location.
 */
const displayGeocodeData = (data) => {
  console.log(data);

  if (!data) {
    throw new Error("Data provided was undefined.");
  }

  const geocodeDiv = document.getElementById("geocode-information");
  geocodeDiv.replaceChildren();

  let showCoordinates = true;

  const lat = parseFloat(data["lat"]);
  const long = parseFloat(data["lon"]);

  if (isNaN(lat)) {
    console.warn("Got NaN for latitude.");
    showCoordinates = false;
  }

  if (isNaN(long)) {
    console.warn("Got NaN for longitude.");
    showCoordinates = false;
  }

  let header = `Weather for ${data["name"]}, ${data["state"]}, ${data["country"]}`;

  if (showCoordinates) {
    header += ` (${lat.toFixed(2)}, ${long.toFixed(2)}):`;
  }

  const p = document.createElement("p");
  p.textContent = header;

  geocodeDiv.appendChild(p);
};

/**
 * Displays weather data by updating the contents of a specific DOM element with the
 * provided weather information. Expects the data parameter to contain properties for
 * temperature (`data.main.temp`), feels-like temperature (`data.main.feels_like`),
 * and wind speed (`data.wind.speed`). Each value is validated and appropriately displayed.
 *
 * @param {Object} data - The weather data object with properties for temperature, feels-like
 *                        temperature, and wind speed.
 * @throws Will throw an error if the provided data is undefined.
 */
const displayWeatherData = (data) => {
  console.log(data);

  if (!data) {
    throw new Error("Data provided was undefined.");
  }

  const weather = {
    temp: "---",
    feelsLikeTemp: "---",
    windSpeed: "---",
  };

  const temp = parseInt(data["main"]["temp"]);

  if (!isNaN(temp)) {
    weather["temp"] = temp;
  }

  const feelsLikeTemp = parseInt(data["main"]["feels_like"]);

  if (!isNaN(feelsLikeTemp)) {
    weather["feelsLikeTemp"] = feelsLikeTemp;
  }

  let windSpeed = data["wind"]["speed"];

  if (windSpeed) {
    if (!isNaN(windSpeed)) {
      weather["windSpeed"] = windSpeed;
    }
  }

  const weatherDiv = document.getElementById("weather");
  weatherDiv.replaceChildren();

  for (const key in weather) {
    const p = document.createElement("p");
    p.textContent = `${key}: ${weather[key]}`;
    weatherDiv.appendChild(p);
  }
};
