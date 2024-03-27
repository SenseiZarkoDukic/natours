const express = require('express');
const { get } = require('http');
const morgan = require('morgan'); // 3rd party middleware

const tourRouter = require('./routes/tourRoutes'); // import the tour router
const userRouter = require('./routes/userRoutes'); // import the user router

const app = express();

// 1) MIDDLEWARES

app.use(morgan('dev')); // logging middleware

app.use(express.json()); // middleware to parse the body of the request

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
}); // custom middleware

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
}); // custom middleware

// 3) ROUTES

app.use('/api/v1/tours', tourRouter); // use the router middleware (mounting the router on a new route - this is a form of middleware stacking or mounting a router on a route)
app.use('/api/v1/users', userRouter); // use the router middleware

module.exports = app;
