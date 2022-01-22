import express from "express";
import ws from "ws";
import path from "path";
import { useServer } from "graphql-ws/lib/use/ws";
import { schema } from "./schema";

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.listen(4001, () => {
  console.log("Express running on 4001");
});

const server = new ws.Server({
  port: 4000,
  path: "/graphql",
});


useServer({ schema }, server);
console.log("running a websocket server on route 4000");
