const express = require('express');
const statisticsController = require('../controllers/statisticsController');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, statisticsController.getStatistics);

module.exports = router;