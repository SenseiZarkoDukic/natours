const express = require('express');

const router = express.Router(); // create a USER router

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
