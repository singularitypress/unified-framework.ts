import { GraphQLFieldConfig, GraphQLList, ThunkObjMap } from "graphql";
import dotenv from "dotenv";
import { Client } from "@notionhq/client";
import { GameType } from "../../types";
import { IGameImages, INotionGamePage } from "../../../@types";

const data: IGameImages = require("../../../data/images.json"); // eslint-disable-line @typescript-eslint/no-var-requires

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

          return res.results.map((item: any) => {
            const {
              properties: { Platform, Price, Completed, Bought, Name },
            } = item as INotionGamePage;

            const name = Name.title[0].text.content;

            return {
              name,
              platform: Platform.select.name,
              completed: Completed.date?.start ?? "",
              bought: Bought.date?.start ?? "",
              price: Price.number,
              minImage: data[name]?.minImage,
              maxImage: data[name]?.maxImage,
            };
          });
        });
    },
  },
};
