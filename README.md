# Unified Framework
The goal of this repo is eventually going to be having a unified GraphQL framework that can sit in front a plurality of REST APIs.

## Getting Started
1. Clone this repo to your local machine, and run `npm i` to get your dependencies.
2. Development is done inside the `typescript` directory
3. `npm run dev` will begin the process of server-side GraphQL development from within the `typescript` directory. Code will be built into and run from the `server` directory.
4. For testing external APIs, you can add whatever you need to `db.json` in the root directory, and run the json server with `npm run json:server`. The server runs on `http://localhost:3000`.

## Wrapping external APIs
In `resolve` for a schema object, you can return an `Axios` call since if GraphQL sees you're returning a `promise`, it's designed to return the data after it's completed.

## Circular References
The `CompanyType` refers to the `UserType`, and the `UserType` refers to the `CompanyType`. We can see off the bat, that this is going to be annoying because if you define one before the other, you'll be using one before it's actually defined. To get around this, we'll make the `fields` property on `UserType` and `CompanyType` to be a closure. This ensures that both types get declared and defined and the `fields` function gets executed after, so if we need to use either type, they'll have been defined first.

Additionally, you need to set the `GraphQLObjectType<any, any> ` type to the schemas since they're referring to each other, making TypeScript freak out.