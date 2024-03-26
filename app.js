const fs = require('fs');
const express = require('express');
const { get } = require('http');
const morgan = require('morgan'); // 3rd party middleware
const crypto = require('crypto');

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

// 2) ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES

app.use('/api/v1/tours', tourRouter); // use the router middleware (mounting the router on a new route - this is a form of middleware stacking or mounting a router on a route)
app.use('/api/v1/users', userRouter); // use the router middleware

// 4) START SERVER

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
