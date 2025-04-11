import axios from "axios";

/**
 * Returns a string containing all the game's platforms formatted in a readble and grammarly correct manner.
 * @param {[object]} platforms
 * @returns Returns a complete string with corrected grammar containing all the game's platforms.
 */
export function concatPlatformString(platforms) {
  let concatedString = "";

  for (let i = 0; i < platforms.length; i++) {
    let currentString;
    if (i === 0) {
      currentString = `${platforms[i].name}${platforms.length === 1 ? "." : ""}`;
    } else if (i === platforms.length - 1) {
      currentString = ` and ${platforms[i].name}.`;
    } else {
      currentString = `, ${platforms[i].name}`;
    }
    concatedString += currentString;
  }

  return concatedString;
}

/**
 * Returns a complete list of all platforms and their respective ids.
 * @param {string} apiKey
 * @returns A concated array of objects containing platform names and ids.
 */
export async function getAllPlatforms(apiKey) {
  let concatedArray = [];

  const numberOfPlatforms = await axios.get(`https://www.giantbomb.com/api/platforms/?format=json&field_list=number_of_total_results&limit=1&api_key=${apiKey}`);

  for (let i = 0; i <= Math.floor(numberOfPlatforms.data.number_of_total_results / 100); i++) {
    const platformsRaw = await axios.get(`https://www.giantbomb.com/api/platforms/?format=json&offset=${100 * i}&field_list=name,id&&sort=name:asc&api_key=${apiKey}`);
    concatedArray = concatedArray.concat(platformsRaw.data.results);
  }

  return concatedArray;
}

/**
 * Returns a random game based on an specific platform (specified by the platformID) or a completely random game (if platformId is 0).
 * @param {string} apiKey
 * @param {number} platformId
 * @returns A Random Game in an object
 */
export async function getRandomGame(apiKey, platformId) {
  const numberOfGamesResponse = await axios.get(`https://www.giantbomb.com/api/games/?format=json&${platformId === 0 ? "" : "platforms=" + platformId + "&"}field_list=number_of_total_results&limit=1&api_key=${apiKey}`);
  const randomGameId = Math.floor(Math.random() * Math.floor(numberOfGamesResponse.data.number_of_total_results / 100));
  const randomGameResponse = await axios.get(`https://www.giantbomb.com/api/games/?format=json&${platformId === 0 ? "" : "platforms=" + platformId + "&"}offset=${randomGameId}&limit=1&field_list=name,image,platforms,deck,original_release_date,site_detail_url&api_key=${apiKey}`);
  return randomGameResponse.data.results[0];
}

/**
 * Returns formatted date in dd/mm/yyyy format.
 * @param {string} inputDate
 * @returns Returns formatted date.
 */
export function formatDate(inputDate) {
  const parts = inputDate.split("-");

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
