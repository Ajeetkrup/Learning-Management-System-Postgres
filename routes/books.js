const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.post('/create', bookController.create);
router.post('/update/:id', bookController.update);
router.get('/delete/:id', bookController.delete);

module.exports = router;