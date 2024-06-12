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

exports.createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

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
