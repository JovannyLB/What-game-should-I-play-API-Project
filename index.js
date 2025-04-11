import express from "express";
import bodyParser from "body-parser";
import { readFileSync } from "fs";
import axios from "axios";
import * as utilities from "./utilities.js";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const apiKey = JSON.parse(readFileSync("./apikey.json")).giantBombKey;

var platformId = 0;

app.get("/", async (req, res) => {
  try {
    const platforms = await utilities.getAllPlatforms(apiKey);
    const randomGame = await utilities.getRandomGame(apiKey, platformId);
    const randomGamePlatforms = utilities.concatPlatformString(randomGame.platforms);

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
