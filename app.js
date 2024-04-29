const express = require('express');

const morgan = require('morgan'); // 3rd party middleware

const tourRouter = require('./routes/tourRoutes'); // import the tour router
const userRouter = require('./routes/userRoutes'); // import the user router

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
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
}); // catch-all route

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

  // console.log(err.stack);
  // res.status(500).json({
  //   status: 'error',
  //   message: err.message,
  // });
}); // error handling middleware

module.exports = app;
