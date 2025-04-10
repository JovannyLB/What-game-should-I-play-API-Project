import express from "express";
import bodyParser from "body-parser";
import { readFileSync } from "fs";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const apiKey = JSON.parse(readFileSync("./apikey.json")).giantBombKey;
const platformList1 = axios.get(`https://www.giantbomb.com/api/platforms/?format=json&sort=name:asc&api_key=${apiKey}`);
const platformList2 = axios.get(`https://www.giantbomb.com/api/platforms/?format=json&offset=100&sort=name:asc&api_key=${apiKey}`);
const gameList = axios.get(`https://www.giantbomb.com/api/games/?format=json&api_key=${apiKey}`);

app.get("/", async (req, res) => {
  try {
    const platform1Response = await platformList1;
    const platform2Response = await platformList2;
    const platforms = platform1Response.data.results.concat(platform2Response.data.results);

    const gameResponse = await gameList;
    const randomGame = gameResponse.data.results[Math.floor(Math.random() * gameResponse.data.results.length)];
    res.render("index.ejs", { platforms: platforms, gameName: randomGame.name, gameImage: randomGame.image.screen_url });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
