# Next Middleware List
This package allows you to separate your middleware into multiple files instead of having one big mono-middleware file.

It works by having a config file, with an array of middlwares (.js/.ts files) to be ran per request in the order they are defined within the config file.

install:
```
npm i next-middleware-list
```

- - -

### Step 1: Create a `middlewares.config.ts` file either in the root or `src` directory
```ts
import { MiddlewareListConfig } from "next-middleware-list"

export const middlewareConfig: MiddlewareListConfig = []
```

- - -

### Step 2: Create a `middleware.ts` file
Create a `middleware.ts` file either in the root or `src` directory and put the following code into it:
```ts
import { withMiddlewareList } from 'next-middleware-list'
import { middlewareConfig } from '...' // replace `...` with the path to your `middlewares.config.ts` file

export default withMiddlewareList(middlewareConfig)
```

- - -

# How To Create A Middleware?

Create a file, for example `withExample.ts`. The file should export a function with 2 arguements (request, response) as follows:
```ts
import { NextRequest, NextResponse } from "next/server";

export async function withExample(request:NextRequest, response:NextResponse) {
  console.log("withExample")
}
```

Now in your `middlewares.config.ts` file modify it as follows:
```ts
import { MiddlewareListConfig } from "next-middleware-list"

import { withExample } from "..." // replace `...` with the path to your middleware file (for example `withExample.ts`)

export const middlewareConfig: MiddlewareListConfig = [
  [withExample, "*"]
]
```

- - -

# Matchers

Each middleware inside of the config are only ran if the url of the request matches one or more  of its matchers.
If the matchers for a given middleware is `"*"` then it will be ran on every request.

Matchers are formatted as follows:
```ts
{
  relMatchers: [...],
  absMatchers: [...],
}
```

`relMatchers` match to the relative url of the request (path name) whereas `absMatchers` match to the absolute url of the request (entire url).
All items inside of `relMatchers` and `absMatchers` must either be a string or a regex. 

- - -

# How To Use NextAuth Middleware With NextMiddlewareList

create a new file called `withAuth.ts` and add this code to it:
```ts
import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log(req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "admin",
    },
  }
)
```
Note: You can modify the middleware to suit your needs.

Add the `withAuth.ts` file to your middleware config:
```ts
export const middlewareConfig: MiddlewareListConfig = [
  [withAuth as any, "*"]
]
```