# Express TypeScript RESTful Boilerplate

Express TypeScript RESTful Boilerplate is a starter kit for building RESTful APIs using [Express](https://expressjs.com) in a [TypeScript](https://www.typescriptlang.org/) environment for [Node.js](https://nodejs.org/en).

> **This boilerplate is functional as is, but it is still a project under development, and there are currently no tests implemented.**

## Included

- All running under [Node](https://nodejs.org/en) 18.18 LTS (or above)
- [TypeScript](https://www.typescriptlang.org/) 5 and [Express](https://www.expressjs.com/) 4
- [ESLint](https://eslint.org/) and [Vitest](https://vitest.dev/)
- [dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow) (for improved environmental variables)
- [ESM](https://nodejs.org/api/esm.html) (top-level awaits please!)
- [GitHub Actions](https://github.com/features/actions) (CI) coming soon
- [Docker](https://www.docker.com/) setup coming soon

## Setup

**Clone the repository:**

```shell
git clone git@github.com:thekeogh/express-typescript-restful-boilerplate.git
```

**Install the dependencies:**

```shell
npm install
```

**Setup SSL**

To enable SSL for the API in local development, you can use a self-signed certificate. To accomplish this, you will need to generate a self-signed SSL certificate locally by following our guide, which is available for both [Microsoft Windows](https://gist.github.com/wmathes/db7524f083e89167111079ff9778330c) and [Apple macOS](https://gist.github.com/thekeogh/ed785cc0e8125731a6ff7fff306bc47e). Once this process is complete, the `server.key` and `server.crt` files will be generated. Copy these SSL files to the `/ssl` directory using the following steps:

> *This step is optional; there's no need to use HTTPS when running the service.*

```shell
cp /path/to/server.key /path/to/server.crt ./ssl
```

**Start the service:**

```shell
npm run dev
```

## Environmental Variables

If the default configuration in the `.env.development` file is not sufficient, you can create a `.env.development.local` file to customise the values according to your requirements.

```shell
touch .env.development.local
```

> *To modify specific values, selectively copy them from the `.env.development` file and paste them here. Only copy the values that you intend to change, and avoid copying any values that do not need to be modified. If no changes are required, completely skip this step.*

## Controllers

All controllers should be stored in the `/resources/{resource}/controllers/{name}.controller.ts` path to ensure they are registered with the router correctly. This registration process is entirely automated.

```typescript
import { Controller } from "@controllers";
import { post } from "@decorators";

import { post, middleware } from "@decorators";

import { users } from "@resources/index.js";

@post("/users")
export class Create extends Controller<Users.Create.Request> {
  
  public async handle(): Promise<Users.Create.Response> {
    return {
      // ...
    };
  }
  
}
```

Request and response types should be defined in `/resources/{resource}/types.d.ts`.

The `@post("/path/to/endpoint")` decorator must be applied, as it registers the route for you. We provide decorators for all HTTP methods (e.g. `@get()`, `@put()` etc).

With these steps, you can easily register a route and controller. The API handles all the necessary registration work for you.

## Middleware

You can add middleware to your routes (controllers) using the `@middleware` decorator. Simply pass the middleware `RequestHandler` as an argument to attach it to the route. Make sure to define the route decorator first, such as `@post`.

```typescript
import { Controller } from "@controllers";
import { post } from "@decorators";

@post("/users")
@middleware(users.middleware.first())
@middleware(users.middleware.second())
export class Create extends Controller<Users.Create.Request> {
  
  public async handle(): Promise<Users.Create.Response> {
    return {
      // ...
    };
  }
  
}
```

To apply middleware to a route (or controller), you can use the `@middleware` decorator, which takes care of this for you. You can define as many middleware functions as you like, ensuring they are registered in the desired order.

> Be sure to define the route decorator first (e.g., `@post`), or the middleware won't be attached to the route.

Alternatively, you can provide an array of middleware to the decorator if preferred:

```typescript
@middleware([users.middleware.first(), users.middleware.second()])
```

This gives you flexibility in managing middleware for your routes.

## Errors

The boilerplate includes a helper function designed to simplify the process of generating errors within your service. To raise an error from your controller, you can simply throw the error, and the service will handle the task of providing the appropriate response to the client.

```typescript
import { Controller } from "@controllers";
import { post } from "@decorators";

import { errors } from "@core/index.js";

import { repository, validation } from "@resources/users/index.js";

@post("/users")
export class Create extends Controller<Users.Create.Request> implements Controllers.Contract<Users.Create.Response> {

  const user = await repository.getByEmail(this.request.body.email);
	if (user) {
    throw errors.conflict("Sorry, this email address is already registered.");
  }
  
  public async handle(): Promise<Users.Create.Response> {
    return {
      // ...
    };
  }
  
}
```

The `errors` object comprises various common error types, such as `notFound()` and `badRequest()`. You can provide a custom message for these errors, but if none is specified, a default message will be used. Additionally, you have the flexibility to generate custom errors using the `Exception` class for situations that do not fit the common error types.

```typescript
const teapot = new Exception<418>(418, "I'm a teapot");
```

## Validation

We harness the robust capabilities of the [class-validator](https://github.com/typestack/class-validator) package, leveraging its declarative validation decorators to meticulously validate incoming client payloads.

```typescript
// create.validation.ts

import { IsEmail } from "class-validator";

export class Create {
  public name: string;

  @IsEmail()
  public email: string;
}
```

These validation rules can then be seamlessly applied to a controller using the `@validate` decorator middleware.

```typescript
import { Controller } from "@controllers";
import { post, validate } from "@decorators";

import { validation } from "@resources/users/index.js";

@post("/users")
@validate(validation.Create) // validation.Create = create.validation.ts
export class Create extends Controller<Users.Create.Request> implements Controllers.Contract<Users.Create.Response> {

  public async handle(): Promise<Users.Create.Response> {
    return {
      // ...
    };
  }
  
}
```

That's all it takes! The attached rules are automatically associated with the route, and should validation fail, a `BadRequest` error will be triggered. Only after successful validation will the request proceed to the controller.

## Response Status Code

By default, all routes will generate a `200 OK` response. You can adjust this behavior individually for each controller using the `@response` decorator.

```typescript
import { Controller } from "@controllers";
import { post, response } from "@decorators";

import { validation } from "@resources/users/index.js";

@post("/users")
@response(201)
export class Create extends Controller<Users.Create.Request> implements Controllers.Contract<Users.Create.Response> {

  public async handle(): Promise<Users.Create.Response> {
    return {
      // ...
    };
  }
  
}
```

> This decorator is exclusively intended for successful response status codes. Error responses should be handled by raising exceptions.

## Build

Since the service is built in TypeScript, it must be compiled to plain JavaScript before it can be deployed in a production environment. To achieve this, you can run the following command

```shell
npm run build
```

> *The resulting JavaScript code should now be compiled and stored in the `/build` directory, which is now ready for deployment in a production environment.*

To execute the compiled JavaScript, simply enter the following command:

```shell
npm start
```

Running the above command in a local environment may result in an error since the required environmental variables are not set. To test the production-ready build locally, you can utilise the development environmental variables instead by executing the following command:

```shell
npm run preview
```

## Lint

To execute ESLint on the service, enter the following command:

```shell
# Check files
npm run eslint

# Fix files
npm run eslint:fix
```

To execute Prettier on the service, enter the following command:

```shell
# Check files
npm run prettier

# Fix files
npm run prettier:fix
```

Or to run both in a single command:

```shell
# Check files (ESLint and Prettier)
npm run lint

# Fix files (ESLint and Prettier)
npm run lint:fix
```

## Tests

[Vitest](https://vitest.dev/) is utilised to execute all tests.

Run the entire test suite:

```shell
npm run test
```

Run specific tests:

```shell
npm run test /path/fuzzy/glob/file
```

Watch for changes:

```shell
npm run test:watch
```
