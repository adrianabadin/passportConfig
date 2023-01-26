# Passport JS Configurator for MongoDB

## Installation:

```bash
npm install passport-fast-config
```

## Implementation:

This package is builded to provide a easy and clean configuration for passport JS implementing persistance in a Mongo Db.

At this moment The package provides two strategies for Passport JS and it sets a basic configuration for both of them, allowing the user to use a dot notation of the strategies to be implemented.

This way, at this moment you can implement Local Strategy and google oAuth 2.0 bye separate or in conjunction.

The package was builded using ECS modules.

```javascript
import {passportConfigBuilder} from "passport-fast-config";
o
const passportConfigBuilder = require("passport-fast-config)
```

Once you have imported the package you should implement your standard server configuration, we will start importing the rest of the dependences needed for the server

```javascript
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
```

Since we have finished the imports we will start our server:

```javascript
const app = express();
app.listen(8080, () => console.log("Server Up"));
```

At this time we need to initialize the express session middleware:

```javascript
const baseSession = session({
  store: MongoStore.create({
    mongoUrl: "connection-string",
  }),
  secret: "password",
  resave: true,
  saveUninitialized: true,
});
```

Before we initialize the session middleware we should call the express.json() middleware to be able to access body data:

```javascript
app.use(express.json());
app.use(baseSession);
```

And at this time we use our package to provide configuration for Passport JS, lets start with **_<u>Local Strategy</u>_** implementation.
We will call **passportConfigBuilder()** function, this function recives a literal object as a parameter.

This object is a mongo DB schema object, and its the only data needed to provide configuration for the entire strategy.

The object will have always 2 keys as default configuration:

1. username
2. password

This is the inner structure of a basic configuration schema for this implementation.

```javascript
const basicSchema = {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
};
```

This means that the data you provide in the configuration object will add more fields to your user registration implementation, but **user** and **password** fields have a **default** configuration set in place.

To call the implementation of our configuration you need to call the method **initializePassport()**

So the basic configuration for this implementation would be :

```javascript
passportConfigBuilder(
  {},
  "connection string for mongo DB"
).initializePassport();
```

And if you need other fields on the login form you should do this:

```javascript
passportConfigBuilder({
	firstName:String,
	lastName:String,
	age:Number
	email:{type:String, required:true}
	}).initializePassport()
```

This would generate 2 authentication patterns

1. 'login' this is the validation login authentication strategy for passport JS
2. 'register' this middleware is in charge of persisting the data provided by the req.body object in the database connection you have set on the top of the file.

After the configuration you need to initialize passport by calling:

```javascript
app.use(passport.initialize());
app.use(passport.session());
```

Then is just matter of implementing the routes using the middleware.

```javascript
app.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failedRegister" }),
  (req, res) => {
    res.send({ message: "Signed Up" });
  }
);

app.post("/failedRegister", (req, res) => {
  res.send({ error: "I cannot authenticate you" });
});
app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/failedLogin" }),
  (req, res) => {
    res.send({ message: "Logged In" });
  }
);
app.post("/failedLogin", (req, res) => {
  res.send({ error: "I cannot log in" });
});
```

So at this point the objective of this package is clearly avoid the boilerplate code needed to instantiate a login/register using passport Local Strategy. Of course the traditional implementation allows a fine tune not provided by this library, but in the habitual scenarios it should be a great tool to use.

### Other spects of passportConfigBuilder function

The function returns 5 elements:

1. _initializePassport_ *method* (explained above)
2. _setCrypt_ *method* sets on or off the password encryption. True by default encripts the password
3. _GoogleoAuth_ *method* configures the data required for google oAuth authentication (explained above)
4. _users Access_ the user model of the mongo database
5. _googleAuthModel_ Acces the googleAuth users model of the mongo database

### Google oAuth 2.0 Strategy for passport JS

Now lets add to the implementation we just wrote a google oAuth login.

Instead of the configuration line placed above, we are gonna use another method, **GoogleoAuth()**

This method takes 2 params:

1. A litteral Object thats contains the api connection strings needed to interact with google.
2. A boolean that takes true if you want **google oAuth** to provide a login only service (it wont register new users) or false if you want google oAuth to create a new user when the email is not registred on the database. Default value for this param is **false**

The configuration object can take the same parameters that passport JS google oAuth strategy takes, so the structure would be like this:

```javascript
{
  clientID: 'xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',
  clientSecret: 'xxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx',
  callbackURL: 'http://adresstoyourgooglecallback'
}
```

So the implementation for a Google oAuth Strategy would be:

```javascript
passportConfigBuilder({}).GoogleoAuth(
  {
    clientID:
      "xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
    clientSecret: "xxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx",
    callbackURL: "http://adresstoyourgooglecallback",
  },
  true
);
```

To end this documentation, the final escenario for this package is the possibility for multiple strategy implementation.

Even when at this point we only provide 2 strategies, will keep on working on the following versions to provide other strategies and other persistance methods.

The code that follows implements both strategies in only one line of code.

```javascript
passportConfigBuilder({})
  .GoogleoAuth(
    {
      clientID:
        "xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
      clientSecret: "xxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx",
      callbackURL: "http://adresstoyourgooglecallback",
    },
    true
  )
  .initializePassport();
```

I hope you find this package usefull, i belive that it adds value to the implementation of most case scenarios of the passport JS framework.

## Version Updates

1. Transpiled code to ES2015 standard allowing imports and require statements
2. Flash messages implemented on the failure branch.

Thanks for your time.
