import express from "express";
import compression from "compression";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema";
require("dotenv").config();

const app = express();

app.use(compression());
app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
