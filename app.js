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
const getAllTours = (req, res) => {
  // console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',

    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  const editedTour = Object.assign(tour, req.body);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          tour: editedTour,
        },
      });
    }
  );
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  const deleteTourObj = tours.splice(tours.indexOf(tour), 1);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: { deleteTourObj },
      });
    }
  );
};
const getAllUsers = (req, res) => {
  if (!users) {
    return res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined',
    });
  }
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};

const getUser = (req, res) => {
  const id = req.params.id;
  const user = users.find((el) => el._id === id);
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

const createUser = (req, res) => {
  const lastId = users[users.length - 1]._id;
  const prefix = lastId.slice(0, -1);
  const lastNum = parseInt(lastId.slice(-1), 10);
  const newId = prefix + (lastNum + 1).toString();

  // Split the name by spaces and take the first part
  const firstName = req.body.name.split(' ')[0];
  // Generate an email by replacing spaces in the name with dots and appending "@example.com"
  const email = `${firstName.toLowerCase()}@example.com`;

  // Set the role and active status
  const role = req.body.role || 'user';
  const active = true;

  // Generate a photo name by replacing spaces in the name with dashes and appending ".jpg"
  const photo = `user-${users.length + 1}.jpg`;

  // Generate a password by hashing the name (this is just an example, you should use a more secure method in a real application)
  const password = crypto
    .createHash('sha256')
    .update(req.body.name)
    .digest('hex');
  const newUser = Object.assign({
    _id: newId,
    name: req.body.name,
    email,
    role,
    active,
    photo,
    password,
  });
  // console.log(lastId, prefix, lastNum, newId, newUser);
  users.push(newUser);
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser,
        },
      });
    }
  );
};

const updateUser = (req, res) => {
  const id = req.params.id;
  const user = users.find((el) => el._id === id);
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  const editedUser = Object.assign(user, req.body);
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          user: editedUser,
        },
      });
    }
  );
};

const deleteUser = (req, res) => {
  const id = req.params.id;
  const user = users.find((el) => el._id === id);
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  const deleteUserObj = users.splice(users.indexOf(user), 1);
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: { deleteUserObj },
      });
    }
  );
};
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES

const tourRouter = express.Router();

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// 4) START SERVER

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
