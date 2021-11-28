import express from "express";
import compression from "compression";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema";
import cors, { CorsOptions } from "cors";
import { wsServer } from "./ws-server";

require("dotenv").config();

const app = express();

const options: CorsOptions = {
  origin: ["http://localhost:3000"],
};

app.use(compression());
app.use(cors(options));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

app.listen(4000, () => {
  console.log("Express running on 4000");
});
wsServer();
