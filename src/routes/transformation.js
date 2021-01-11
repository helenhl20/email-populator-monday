const express = require('express');
const router = express.Router();

const transformationController = require('../controllers/integration-controller.js');
const authenticationMiddleware = require('../middlewares/authentication').authenticationMiddleware;

router.post('/transformation/transform', authenticationMiddleware, transformationController.transformToMondayColumn);
router.post('/transformation/types', authenticationMiddleware, transformationController.getTransformationTypes);
router.post('/transformation/subscribe', authenticationMiddleware, transformationController.subscribe);
router.post('/transformation/unsubscribe', authenticationMiddleware, transformationController.unsubscribe);
router.post('/transformation/people', authenticationMiddleware, transformationController.populateTextColumnFromPeopleColumn);

module.exports = router;
