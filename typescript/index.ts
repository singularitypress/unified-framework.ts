import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

const root = {
};

const app = express();

app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
