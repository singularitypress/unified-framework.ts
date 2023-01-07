import express from "express";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
  sendResult,
} from "graphql-helix";
import dotenv from "dotenv";
import cors from "cors";
import { schema } from "@graphql/schema";
import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { ITransaction } from "@types";
const app = express();

dotenv.config();

const fileData = readdirSync(resolve(__dirname, "../", "db")).reduce(
  (currList, currFileName) => {
    return [
      ...currList,
      ...(JSON.parse(
        readFileSync(resolve(__dirname, "../", "db", currFileName), {
          encoding: "utf-8",
        }),
      ) as ITransaction[]),
    ];
  },
  [] as ITransaction[],
);

const HFER_e = JSON.parse(
  readFileSync(resolve(__dirname, "..", "elections", "HFER_e.json"), {
    encoding: "utf-8",
  }) ?? "[]",
);

const elections = JSON.parse(
  readFileSync(resolve(__dirname, "elections", "elections.json"), {
    encoding: "utf-8",
  }) ?? "{}",
);

app.use(express.json());

app.use(
  cors(process.env.ENV === "dev" ? { origin: "http://localhost:3000" } : {}),
);

app.use("/", async (req, res) => {
  // Create a generic Request object that can be consumed by Graphql Helix's API
  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  };

  // Determine whether we should render GraphiQL instead of returning an API response
  if (shouldRenderGraphiQL(request) && process.env.ENV === "dev") {
    res.send(renderGraphiQL());
  } else {
    // Extract the Graphql parameters from the request
    const { operationName, query, variables } = getGraphQLParameters(request);

    // Validate and execute the query
    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema: schema(fileData, HFER_e, elections),
    });

    sendResult(result, res);
  }
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`GraphQL server is running on port ${port}.`);
});
