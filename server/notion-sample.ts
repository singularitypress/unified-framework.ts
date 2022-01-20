import dotenv from "dotenv";
import { Client } from "@notionhq/client";

import fs from "fs";

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const notionSample = async () => {
  const myPage = await notion.databases.query({
    database_id: process.env.DATABASE ?? ""
  });

};