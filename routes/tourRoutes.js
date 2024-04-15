const express = require('express');
const tourController = require('../controllers/tourController'); // import the tour controller
const router = express.Router(); // create a TOUR router

const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  // checkID,
  // checkBody,
} = tourController;
//
// router.param('id', checkID);
router.route('/top-5-cheap').get(tourController.getAllTours);

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
