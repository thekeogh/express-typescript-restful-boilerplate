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

## Authentication

By default, all endpoints on the API remain unprotected, allowing unrestricted access to anyone. Currently, the API exclusively supports JWT (JSON Web Token) authentication using the HS256 algorithm. To enable authentication for your endpoints, you need to configure your `.env` file as follows:

```shell
# HS256 secret signing key used to verify incoming JWTs.
AUTH_JWT_SECRET=mytopsecretkey

# If specified, the JWT `aud` (audience) will be verified against this value.
AUTH_JWT_AUDIENCE=

# If specified, the JWT `iss` (issuer) will be verified against this value.
AUTH_JWT_ISSUER=
```

Once you've configured the `.env` file, it's straightforward to protect your controllers. To achieve this, use the `@guard` decorator as shown below:

```typescript
import { Controller } from "@controllers";
import { post, guard } from "@decorators";

import { users } from "@resources/index.js";

@post("/users")
@guard()
export class Create extends Controller<Users.Create.Request> {
  
  public async handle(): Promise<Users.Create.Response> {
    
    const sub = this.request.auth.sub;
    const name = this.request.auth.name;
    
    return {
      // ...
    };
  }
  
}
```

Now, the specified route is protected, and a valid JWT is required to access this controller. You can access the JWT payload using the `this.request.auth` property, as demonstrated above.

To define your JWT payload, make adjustments to the `User` interface within the `types/express.d.ts` definition:

```typescript
interface User {
  name: string;
  email: string;
  sub: string;
  iat: number;
  exp: number;
  aud: string | string[];
  iss: string;
}
```

By defining this interface, you gain access to correct auto-completion when working with the 
`this.request.auth` property.

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

## Handling Errors

We've implemented a robust error handling system to ensure that your Express-based applications handle errors gracefully and provide meaningful responses to clients. We leverage the [http-errors](https://github.com/jshttp/http-errors) package to simplify the process of creating and throwing HTTP errors.

```typescript
import { Controller } from "@controllers";
import { post } from "@decorators";

import { errors } from "@core/index.js";

import { repository, validation } from "@resources/users/index.js";

@post("/users")
export class Create extends Controller<Users.Create.Request> implements Controllers.Contract<Users.Create.Response> {

  const user = await repository.getByEmail(this.request.body.email);
  if (user) {
    throw errors.Conflict("Sorry, this email address is already registered.");
  }
  
  public async handle(): Promise<Users.Create.Response> {
    return {
      // ...
    };
  }
  
}
```

The [http-errors](https://github.com/jshttp/http-errors) package is a powerful tool that simplifies error handling in Express applications. It provides a convenient way to create HTTP errors with customisable status codes and messages. Here's some examples of how to use it to throw an error:

```typescript
throw createError(404, "Resource not found");
throw createError(404, err, { expose: false });
throw createError.BadRequest();
```

The boilerplate takes care of capturing and presenting errors to consumers in a user-friendly way. Whether it's a validation error, a database issue, or any other unexpected problem, the boilerplate ensures that the appropriate HTTP error is thrown and that the error response is handled consistently. This way, your clients receive clear and informative error messages, making debugging and issue resolution much smoother.

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

## Logging

### Logging in the API

Our boilerplate fully utilises [Pino]((https://github.com/pinojs/pino)) for all logging requirements. You can configure Pino's environment settings in your `.env` files, and for more specific configurations, refer to the logger located at `src/core/logger/api.logger.ts`.

For comprehensive details, please consult the [Pino documentation on its GitHub repository](https://github.com/pinojs/pino).

To perform logging in the API, you can simply use the logger object just as you would with a Pino instance.

```typescript
import { Controller } from "@controllers";
import { post } from "@decorators";
import { log } from "@logger";

@post("/users")
export class Create extends Controller<Users.Create.Request> implements Controllers.Contract<Users.Create.Response> {

  public async handle(): Promise<Users.Create.Response> {
    
    log.info("Create endpoint called successfully.");
    
    const user = await repository.getByEmail(this.request.body.email);
    if (user) {
      log.error(user, "We could not find this user.")
    }
    
    return {
      // ...
    };
  }
  
}
```

Automated error logging is handled for you when an error occurs that doesn't match the ignored HTTP status codes specified in the configuration (as shown [below](#ignoring-errors)).

### Sentry Integration

The boilerplate API includes built-in support for logging errors to Sentry. To enable Sentry logging, simply set your Sentry DSN (Data Source Name) in the `.env` file as follows:

```shell
LOGGING_SENTRY_DSN=https://your-sentry-dsn-goes-here
```

By default, the API logs all relevant errors to Sentry. However, you have complete control over which errors are sent to Sentry by altering the ignored list (see [below](#ignoring-errors))

### Ignoring Errors

By default, the API logs all relevant errors. However, you have complete control over which errors are logged. To exclude specific status codes from being logged, add them to the `ignore` array located within `src/core/config/api.config.ts`:

```typescript
export const logging = {
  api: {
    ignore: {
      codes: [301, 307, 308, 401, 402, 403, 404, 405, 409, 418, 422],
    },
  },
};
```

If an error occurs with one of the HTTP status codes listed above, it will not be logged.

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
