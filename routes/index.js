const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/books', require('./books'));
router.use('/records', require('./records'));
router.use('/payments', require('./payments'));
router.use('/statistics', require('./statistics'));

module.exports = router;