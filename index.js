import express from "express";
import bodyParser from "body-parser";
import { readFileSync } from "fs";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const apiKey = JSON.parse(readFileSync("./apikey.json")).giantBombKey;

const platform1Raw = axios.get(`https://www.giantbomb.com/api/platforms/?format=json&sort=name:asc&api_key=${apiKey}`);
const platform2Raw = axios.get(`https://www.giantbomb.com/api/platforms/?format=json&offset=100&sort=name:asc&api_key=${apiKey}`);

var platformId = 0;

app.get("/", async (req, res) => {
  try {
    const platforms1Response = await platform1Raw;
    const platforms2Response = await platform2Raw;
    const platforms = platforms1Response.data.results.concat(platforms2Response.data.results);

    const numberOfGamesResponse = await axios.get(`https://www.giantbomb.com/api/games/?format=json&${platformId === 0 ? "" : "platforms=" + platformId + "&"}field_list=number_of_total_results&limit=1&api_key=${apiKey}`);
    const randomGameId = Math.floor(Math.random() * (numberOfGamesResponse.data.number_of_total_results / 100));
    const randomGameResponse = await axios.get(`https://www.giantbomb.com/api/games/?format=json&${platformId === 0 ? "" : "platforms=" + platformId + "&"}offset=${randomGameId}&limit=1&field_list=name,image,platforms,deck,original_release_date,site_detail_url&api_key=${apiKey}`);
    const randomGame = randomGameResponse.data.results[0];

    var randomGamePlatforms = "";

    for (let i = 0; i < randomGame.platforms.length; i++) {
      let currentString;
      if (i === 0) {
        currentString = `${randomGame.platforms[i].name}${randomGame.platforms.length === 1 ? "." : ""}`;
      } else if (i === randomGame.platforms.length - 1) {
        currentString = ` and ${randomGame.platforms[i].name}.`;
      } else {
        currentString = `, ${randomGame.platforms[i].name}`;
      }
      randomGamePlatforms += currentString;
    }

    console.log(randomGame.site_detail_url);

    res.render("index.ejs", { platforms: platforms, platformId: Number(platformId), gameName: randomGame.name, gameImage: randomGame.image.small_url, gamePlatforms: randomGamePlatforms, gameDeck: randomGame.deck, gameReleaseDate: randomGame.original_release_date, gameLink: randomGame.site_detail_url });

    platformId = 0;
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/get-platform", (req, res) => {
  platformId = req.body.platform;

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
