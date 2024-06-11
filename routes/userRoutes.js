const express = require('express');
const userController = require('../controllers/userController'); // import the user controller
const authController = require('../controllers/authController'); // import the auth controller

const { getAllUsers, getUser, createUser, updateUser, deleteUser } =
  userController; // destructure the functions from the user controller

const router = express.Router(); // create a USER router

router.post('/signup', authController.signup); // create a new user

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router; // export the router
