const express = require('express');
const userController = require('../controllers/userController'); // import the user controller
const authController = require('../controllers/authController'); // import the auth controller

const { getAllUsers, getUser, createUser, updateUser, deleteUser } =
  userController; // destructure the functions from the user controller

const router = express.Router(); // create a USER router

router.post('/signup', authController.signup); // create a new user
router.post('/login', authController.login); // login a user

router.post('/forgotPassword', authController.forgotPassword); // forgot password
router.patch('/resetPassword/:token', authController.resetPassword); // reset password
router.patch('/updateMyPassword', authController.updatePassword); // update password

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router; // export the router
