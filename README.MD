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
//ESM MODULES
import passportConfig from "passport-fast-config";
const passportConfigBuilder = passportConfig.default
//COMMON JS 
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
Use the session store adecuate to your database of choice, at the time **Mongo DB** or **SQL with Knex JS**

**MONGO SESSION**
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
**KNEXJS SESSION**
```javascript
const KnexSessionStore = require('connect-session-knex')(session)
const store = KnexSessionStore({tablename:'users'})
const sesssionMiddleware = session({
    store,
    secret: 'Lorem Ipsum',
    cookie: { maxAge: 600000 },
    resave: false,
    saveUninitialized: false
  })
```

Before we initialize the session middleware we should call the express.json() middleware to be able to access body data:

```javascript
app.use(express.json());
app.use(baseSession);
```

And at this time we use our package to provide configuration for Passport JS, lets start with **_<u>Local Strategy</u>_** implementation.
We will call **passportConfigBuilder()** function, this function recives a mongoose **Schema** as the first parameter and a string to chose the databse used with passport js at this point we only have mongoose implemented but we will have mysql and firebase as son as possible

The schema or table **will not have username and password fields on their structure** they will be added automatically by this package

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
  isVerified:{
    type:Boolean
  }
};
```

This means that the data you provide in the database schema object will add more fields to your user registration implementation, but **username** and **password** fields have a **default** configuration set in place.

To call the implementation of our configuration you need to call the method **buildLocalConfig()**

So the basic configuration for this implementation would be :

**MONGO**
only in common JS 
```javascript
passportConfigBuilder(new Schema({}),"MONGO").buildLocalConfig();
```
ESM modules 
```javascript
const pass=(await passportConfigBuilder({db:"mongo url",dbSchema:{Schema Definition}},"MONGO")).buildLocalConfig();
```

**KNEX JS**
```javascript
passportConfigBuilder({db:KnexConnection,
  dbSchema:{
    email:"string",
    age:"integer"
}},"SQL").buildLocalConfig();
```
And if you need other fields on the login form you should do this:

```javascript
passportConfigBuilder(new Schema({
	firstName:String,
	lastName:String,
	age:Number
	email:{type:String, required:true}
	}),"MONGO").buildLocalConfig()
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

So at this point the objective of this package is clearly avoid the boilerplate code needed to instantiate a login/register using passport Local Strategy. Of course the traditional implementation allows a fine tune not provided by this function, but in the habitual scenarios it should be a great tool to be used.

### Other spects of passportConfigBuilder function

The function returns 5 elements:

1. **buildLocalConfig** **method** (explained above)
2. **setCrypt** **method** sets on or off the password encryption. True by default encripts the password
3. **GoogleoAuth** **method** configures the data required for google oAuth authentication (explained above)
4. **localModel** Access the users model of the database
5. **goaModel** Access the googleAuth users model of the mongo database
6. **setUserNotFoundMessage** **method** sets custom error user not found message
7. **setIncorrectPassword** **method** sets custom error for incorrect password message
8. **setUserAlrreadyExistsMessage** **method** sets custom error for user already exists message
9. **hasVerification** **method** enables verification to login implementation ti requires a field isVerified to be true before autenticathing a user even if the username and password are correct 
10. **setNotVerifiedMessag** **method** Sets custom message to be displayed when isVerified is set to false 


### Google oAuth 2.0 Strategy for passport JS

Now lets add to the implementation google oAuth login.

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
passportConfigBuilder(new Schema({}),"MONGO")
  .GoogleoAuth(
    {
      clientID:
        "xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
      clientSecret: "xxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxx",
      callbackURL: "http://adresstoyourgooglecallback",
    },
    true
  )
  .buildLocalConfig();
```

I hope you find this package usefull, i belive that it adds value to the implementation of most case scenarios of the passport JS framework.

## Google o Auth Scopes
The library has implemented a request of extended data from people API to be added to the register capacity of the google oauth Implementation. 
To use this feature you need to verify your app in the google developer console, because any other way you will not get the data from google servers.
In Development mode you can use the test users to be able to see the functionality, but remember that this is a feature that need google aprobal to work on production. 
To make use of this functionality you just need to add scopes to your route request.
It will show the user the autorization page to the data you are requesting and in the case of authorization it will automatically generate a new registred user adding the expanded scope to your database.
Phone Numbers and adresses may not be automatically added because the api only provides that information of the users that have been registred that information on ther profiles. 
Phone Numbers that are registred only on the account recovery data will not be automatically added and you may need to implement a manual form to do so.

### Scopes and permissions added to the package

```javascript
scope:[   
    "openid",
    "profile",
    "email",
    "https://www.googleapis.com/auth/user.addresses.read",
    "https://www.googleapis.com/auth/user.birthday.read",
    "https://www.googleapis.com/auth/user.emails.read",
    "https://www.googleapis.com/auth/user.gender.read",
    "https://www.googleapis.com/auth/user.organization.read",
    "https://www.googleapis.com/auth/user.phonenumbers.read",
]
```
#### Example Request
```javascript

router.get("/goa",passport.authenticate("google",{scope:[
    "openid",
    "profile",
    "email",
    "https://www.googleapis.com/auth/contacts",
    "https://www.googleapis.com/auth/directory.readonly",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/user.birthday.read",
    "https://www.googleapis.com/auth/user.phonenumbers.read",
    "https://www.googleapis.com/auth/user.gender.read",
    "https://www.googleapis.com/auth/user.addresses.read",
    "https://www.googleapis.com/auth/user.organization.read",

]}))
```



## Version Updates

1. Base app.js version builded in commonjs to garantee module interoperability
2. Flash messages implemented on the failure branch and the success branch.
3. Typescript type definitions added to the package
4. Typescript native module added to the package
5. Custom message seters implemented
6. Fixed mongoose connection error on ESM modules
7. Added suport to people api to request more information
Thanks for your time.
