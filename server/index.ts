import express from "express";
import path from "path";
import fs from "fs";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schemas";
require("dotenv").config();

const app = express();

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true,
}));

app.get("/xlsx", (req, res) => {
  fs.readFile(path.resolve(`${process.env.XLSX}`), "utf-8", (err, data) => {
    if (err) res.send("fail");
    const strArr = data.split("\n").map((str) => str.split(","));
    const parsed = strArr.reduce((previousValue: any, currentValue) => {
      previousValue.push({
        date: currentValue[0],
        tx: currentValue[1],
        amt: currentValue[2]?.replace("\r", ""),
      });
      return previousValue;
    }, []);
    parsed.pop();
    res.send(JSON.stringify(parsed));
  });
});

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
