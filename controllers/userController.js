const fs = require('fs');
const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
// );

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
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

exports.updateUser = catchAsync(async (req, res) => {
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
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
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
  await User.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
