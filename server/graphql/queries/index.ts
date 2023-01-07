import { ITransactionArgs } from "@types";
import {
  GraphQLFieldConfig,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  ThunkObjMap,
} from "graphql";

const TransactionQuery = {
  type: new GraphQLObjectType({
    
  }),
  resolve: (parent: any, {}: ITransactionArgs) => {}
}

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      alphabet: {
        type: new GraphQLList(GraphQLString),
        resolve: async function* () {
          for (let letter = 65; letter <= 90; letter++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            yield String.fromCharCode(letter);
          }
        },
      },
      song: {
        type: new GraphQLObjectType({
          name: "Song",
          fields: () => ({
            firstVerse: {
              type: GraphQLString,
              resolve: () => "Now I know my ABC's.",
            },
            secondVerse: {
              type: GraphQLString,
              resolve: () =>
                new Promise((resolve) =>
                  setTimeout(
                    () => resolve("Next time won't you sing with me?"),
                    5000,
                  ),
                ),
            },
          }),
        }),
        resolve: () => ({}),
      },
    }),
  }),
});
