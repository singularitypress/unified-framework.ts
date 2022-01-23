import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLString,
  ThunkObjMap,
} from "graphql";
import dotenv from "dotenv";
import { Client } from "@notionhq/client";
import { GameType } from "../../types";
import { IGameImages, INotionGamePage } from "../../../@types";

const data: IGameImages = require("../../../data/images.json"); // eslint-disable-line @typescript-eslint/no-var-requires

dotenv.config();

export const gamesQueries: ThunkObjMap<GraphQLFieldConfig<any, any>> = {
  games: {
    type: new GraphQLList(GameType),
    args: {
      buyStartDate: {
        type: GraphQLString,
      },
      buyEndDate: {
        type: GraphQLString,
      },
      completedStartDate: {
        type: GraphQLString,
      },
      completedEndDate: {
        type: GraphQLString,
      },
      isCompleted: {
        type: GraphQLBoolean,
      },
      include: {
        type: new GraphQLList(GraphQLString),
      },
      exclude: {
        type: new GraphQLList(GraphQLString),
      },
      platform: {
        type: new GraphQLList(GraphQLString),
      },
    },
    resolve: async (parentValue, args) => {
      const {
        buyStartDate = parentValue?.buyStartDate,
        buyEndDate = parentValue?.buyEndDate,
        completedStartDate = parentValue?.completedStartDate,
        completedEndDate = parentValue?.completedEndDate,
        isCompleted = parentValue?.isCompleted,
        include = parentValue?.include,
        exclude = parentValue?.exclude,
        platform = parentValue?.platform,
      } = args;

      const notion = new Client({
        auth: process.env.NOTION_TOKEN,
      });

      const { results } = await notion.databases.query({
        database_id: process.env.DATABASE ?? "",
      });

      let filteredData = results.map((item: any) => {
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

      if (buyStartDate) {
        filteredData = filteredData.filter(
          ({ bought }) => new Date(bought) >= new Date(buyStartDate),
        );
      }

      if (buyEndDate) {
        filteredData = filteredData.filter(
          ({ bought }) => new Date(bought) <= new Date(buyEndDate),
        );
      }

      if (completedStartDate) {
        filteredData = filteredData.filter(
          ({ completed }) =>
            completed && new Date(completed) >= new Date(completedStartDate),
        );
      }

      if (completedEndDate) {
        filteredData = filteredData.filter(
          ({ completed }) =>
            completed && new Date(completed) <= new Date(completedEndDate),
        );
      }

      if (isCompleted) {
        filteredData = filteredData.filter(({ completed }) => completed);
      }

      if (include) {
        filteredData = filteredData.filter(({ name }) =>
          name
            .toLowerCase()
            .match(
              new RegExp(
                `(${include
                  .map((item: string) => item.toLowerCase())
                  .join("|")})`,
                "g"
              ),
            ),
        );
      }

      if (exclude) {
        filteredData = filteredData.filter(({ name }) =>
          !name
            .toLowerCase()
            .match(
              new RegExp(
                `(${exclude
                  .map((item: string) => item.toLowerCase())
                  .join("|")})`,
                "g"
              ),
            ),
        );
      }

      if (platform) {
        filteredData = filteredData.filter((data) =>
          data.platform
            .toLowerCase()
            .match(
              new RegExp(
                `(${platform
                  .map((item: string) => item.toLowerCase())
                  .join("|")})`,
                "g"
              ),
            ),
        );
      }

      return filteredData;
    },
  },
};
