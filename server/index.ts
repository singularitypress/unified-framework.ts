import express from "express";
import compression from "compression";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema";

import fs from "fs";
import path from "path";
import { bnsParser } from "./services";

require("dotenv").config();

const app = express();

app.use(compression());
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

app.get("/xlsx", (req, res) => {
  let arr = [] as any[];
  if (process.env.BNS) {
    arr = [...bnsParser(path.resolve(process.env.BNS))];
  }
  res.send(arr);
});

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
