const fs = require('fs');
const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
// );

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;

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
});

exports.getUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const features = new APIFeatures(User.findById(id), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const user = await features.query;
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
});

exports.createUser = (req, res) => {
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
    `${__dirname}/../dev-data/data/users.json`,
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

exports.updateUser = (req, res) => {
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
    `${__dirname}/../dev-data/data/users.json`,
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

exports.deleteUser = (req, res) => {
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
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: { deleteUserObj },
      });
    }
  );
};
