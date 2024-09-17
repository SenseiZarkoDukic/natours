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

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
