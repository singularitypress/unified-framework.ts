import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { INotionGamePage } from "../@types";

dotenv.config();

export const setImages = async () => {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const pagesToUpdate = await notion.databases
    .query({
      database_id: process.env.DATABASE ?? "",
    })
    .then((res) => res.results);

  pagesToUpdate.filter((page: any) => {
    (page as INotionGamePage).properties["Small Image"];
  });
};
