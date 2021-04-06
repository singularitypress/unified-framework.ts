# Unified Framework
The goal of this repo is eventually going to be having a unified GraphQL framework that can sit in front a plurality of REST APIs.

## Note
The basis of the `prototype-auth` code is from https://github.com/StephenGrider/auth-graphql-starter, I would recommend *against* using anything in here as it's based on 4 year old dependencies that are very much insecure.

## TODO
Re-make the `prototype-auth` code in the main codebase using modern libraries and typescript.

## Getting Started
1. Clone this repo to your local machine, and run `npm i` to get your dependencies.
2. Development is done inside the `typescript` directory
3. `npm run dev` will begin the process of server-side GraphQL development from within the `typescript` directory. Code will be built into and run from the `server` directory.
4. For testing external APIs, you can add whatever you need to `db.json` in the root directory, and run the json server with `npm run json:server`. The server runs on `http://localhost:3000`.

## Wrapping external APIs
In `resolve` for a schema object, you can return an `Axios` call since if GraphQL sees you're returning a `promise`, it's designed to return the data after it's completed.

## Circular References
* The `CompanyType` refers to the `UserType` in its `field` property, and the `UserType` refers to the `CompanyType` in its `field` property.
* We can see off the bat, that this is going to be annoying because if you define one before the other, you'll be using the other before it's actually defined.
  * i.e. If you define `const UserType` before `const CompanyType`, the `UserType` will be referring to `CompanyType` in the `fields` property before `CompanyType` is technically defined.
* To get around this, we'll make the `fields` property on `UserType` and `CompanyType` to be a closure (function). This ensures that `UserType` and `CompanyType` get declared and defined and the `fields` function gets executed after since it's just a function definition and not just an object, so if we need to use either type, they'll have been defined first.
* Additionally, you need to set the `GraphQLObjectType<any, any> ` type to the schemas since they're referring to each other, making TypeScript freak out.

## Reusable Queries
A basic query to get a company with an id of `"1"` would look like this:

*fig 1.*
```graphql
{
  company(id: "1") {
    id
    name
    description
  }
}
```
Which would translate into:

*fig 1.1.*
```json
{
  "data": {
    "company": {
      "id": "1",
      "name": "Apple",
      "description": "iOS"
    }
  }
}
```
You can alias your queries like so:

*fig 2.*
```graphql
{
  company(id: "1") {
    id
    name
    description
  }
}
```
Which translates into:

*fig 2.1.*
```json
{
  "data": {
    "apple": {
      "id": "1",
      "name": "Apple",
      "description": "iOS"
    }
  }
}
```
Aliasing your queries is useful if you want to query two companies, one with the id of `"1"` and another with the id of `"2"`, it would look like this:

*fig 3.*
```graphql
{
  apple: company(id: "1") {
    id
    name
    description
  }
  google: company(id: "2") {
    id
    name
    description
  }
}
```
Which would translate into:

*fig 3.1.*
```json
{
  "data": {
    "apple": {
      "id": "1",
      "name": "Apple",
      "description": "iOS"
    },
    "google": {
      "id": "2",
      "name": "Google",
      "description": "Android"
    }
  }
}
```
In the above example, we can see some repetition with `id`, `name`, `description` being written out twice. When it's just those 3 properties we're accessing it's not that annoying, but if we wanted to access the same 6 properties for example on each, it'd be annoying. In that case we can do the following:

*fig 4.*
```
fragment companyDeets on Company {
  id
  name
  description
}

{
  apple: company(id: "1") {
    ...companyDeets
  }
  google: company(id: "2") {
    ...companyDeets
  }
}
```
The result is the same as *fig 3.1.*

## Mutation Basics
As per `./server/schema/mutations/index.ts`, we can see that we're not posting an `id` despite the user type having one, and that's because GraphQL seemingly makes that property for you automatically.

## Setting up CSV Paths
### Path structure
To parse all of your transaction CSVs they need to be set up in a specific (unfortunately opinionated) directory structure. Your directory should look like: `<root>/<bank>/<account>/<filename>.csv`.
### Using the path
As per the query in `server/schema/queries/transactions/index.ts`, we're using `process.env.ROOT`; you need to create a `.env` file in the root directory of this project and add: `ROOT=<your directory>`. 