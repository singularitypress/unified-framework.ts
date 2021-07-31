/**
 * This is just a test for using the existin graphql implementation with websockets.
 * If it works we can replace the existing express implementation, or live along side
 * it on a different port.
 */

import ws from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { schema } from "./schema";

const server = new ws.Server({
  port: 4001,
  path: "/graphql",
});

export const wsServer = () => {
  useServer({ schema }, server);
  console.log("running a websocket server on route 4001");
};
