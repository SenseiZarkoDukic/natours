const express = require('express');
const tourController = require('./../controllers/tourController'); // import the tour controller
const router = express.Router(); // create a TOUR router
const authController = require('./../controllers/authController');

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
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/').get(authController.protect, getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
