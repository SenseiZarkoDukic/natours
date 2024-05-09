const express = require('express');
const mongoose = require('mongoose'); // import mongoose
const morgan = require('morgan'); // 3rd party middleware
const AppError = require('./utils/appError'); // import the AppError class
const globalErrorHandler = require('./controllers/errorController'); // import the global error handler
const tourRouter = require('./routes/tourRoutes'); // import the tour router
const userRouter = require('./routes/userRoutes'); // import the user router
const tourController = require('./controllers/tourController'); // import the tour controller

const app = express();

// 1) MIDDLEWARES

console.log(process.env.NODE_ENV); // environment variable
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // logging middleware
}

app.use(express.json()); // middleware to parse the body of the request
app.use(express.static(`${__dirname}/public`)); // middleware to serve static files

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
}); // custom middleware

// 3) ROUTES

app.use('/api/v1/tours', tourRouter); // use the router middleware (mounting the router on a new route - this is a form of middleware stacking or mounting a router on a route)
app.use('/api/v1/users', userRouter); // use the router middleware

app.use('id', (req, res, next, val) => {
  if (!mongoose.Types.ObjectId.isValid(val)) {
    return res.status(400).send('Invalid ObjectId');
  }
  next();
}); // middleware to check if the id is a valid ObjectId

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // console.log(req.originalUrl);
}); // catch-all route

app.use(globalErrorHandler); // error handling middleware

module.exports = app;
