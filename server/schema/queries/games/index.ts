import { GraphQLFieldConfig, GraphQLList, ThunkObjMap } from "graphql";
import dotenv from "dotenv";
import fs from "fs";
import { Client } from "@notionhq/client";
import { GameType } from "../../types";
import { INotionGamePage } from "../../../@types";

dotenv.config();

export const gamesQueries: ThunkObjMap<GraphQLFieldConfig<any, any>> = {
  games: {
    type: new GraphQLList(GameType),
    resolve() {
      const notion = new Client({
        auth: process.env.NOTION_TOKEN,
      });

      return notion.databases
        .query({
          database_id: process.env.DATABASE ?? "",
        })
        .then((res) => {
          // fs.writeFileSync("./notion.json", JSON.stringify(res.results));
          return res.results.map((item: any) => {
            const {
              properties: { Platform, Price, Completed, Bought, Name },
            } = item as INotionGamePage;

            const name = Name.title[0].text.content;
            const normalizedName = name
              .toLowerCase()
              .replace(" - ", "-")
              .replace(/\s/g, "-")
              .replace("+", "plus")
              .replace("&", "and")
              .replace(".", "")
              .replace(":", "");

            const minImage =
              Platform.multi_select[0].name === "Switch"
                ? `${process.env.NINTENDO_MIN_IMG}/${
                  name.toLowerCase()[0]
                }/${normalizedName}-switch/hero?v=2022011220`
                : "";
            const maxImage =
              Platform.multi_select[0].name === "Switch"
                ? `${process.env.NINTENDO_MAX_IMG}/${
                  name.toLowerCase()[0]
                }/${normalizedName}-switch/hero?v=2022011220`
                : "";

            return {
              name,
              platform: Platform.multi_select[0].name,
              completed: Completed.date?.start ?? "",
              bought: Bought.date?.start ?? "",
              price: Price.number,
              minImage,
              maxImage,
            };
          });
        });
    },
  },
};
