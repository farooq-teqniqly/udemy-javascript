import fs from "fs/promises";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const serverUrl = "http://localhost:2525/imposters";
const encoding = "utf-8";

const configFiles = [
  "mountebank-geocode-api-impostor.json",
  "foo",
  "mountebank-weather-api-impostor.json",
];

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

const headers = {
  "Content-Type": "application/json",
};

const removeBOM = (content) => {
  return content.charCodeAt(0) === 0xfeff ? content.substring(1) : content;
};

for (const configFile of configFiles) {
  fs.readFile(path.join(currentDirectory, configFile), encoding)
    .then((content) => {
      content = removeBOM(content);
      const json = JSON.parse(content);
      const body = JSON.stringify(json);

      return fetch(serverUrl, {
        method: "POST",
        headers,
        body,
      });
    })
    .then((res) => {
      if (!res.ok) {
        console.error(
          `Error submitting Mountebank configuration: ${res.statusText}`,
        );
      }

      return res.json();
    })
    .then((_) => {
      console.log("Successfully submitted Mountebank configuration");
    })
    .catch((error) => {
      console.error(error);
    });
}
