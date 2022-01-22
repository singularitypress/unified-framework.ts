import playwright from "playwright";
import fs from "fs";
import path from "path";
import { IGameImages } from "../@types";

const json: IGameImages = require("../data/images.json"); // eslint-disable-line @typescript-eslint/no-var-requires

export const scraper = async (games: string[], data: IGameImages) => {
  console.log(games);
  const browser = await playwright.chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const smTimeout = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
  const mdTimeout = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;

  for (let i = 0; i < games.length; i++) {
    const title = games[i];

    if (!data[title]) {
      await page.goto("https://bing.com");
      await page.waitForTimeout(smTimeout);
      await page.type("input", `site:igdb.com/games ${title}`);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(smTimeout);
      await page.click("a[href^='https://www.igdb']");
      await page.waitForTimeout(mdTimeout);
      const minImage =
        (await page.$eval(".gamepage-cover > img", (img) =>
          img.getAttribute("src"),
        )) ?? "";

      const maxImage = await page.$eval(
        ".parallax-background",
        (background) => {
          return background.style.backgroundImage
            .replace("url(", "")
            .replace(")", "")
            .replace(/"/g, "");
        },
      );

      data[title] = {
        minImage,
        maxImage,
      };
    }
  }

  fs.writeFile(
    path.resolve(__dirname, "../", "data/images.json"),
    JSON.stringify(data),
    () => {
      page.close();
      browser.close();
    },
  );
};