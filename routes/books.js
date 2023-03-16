const express = require('express');
const bookController = require('../controllers/bookController');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, bookController.getBooks);
router.get('/available', auth, bookController.userGetBooks);
router.get('/:id', auth, bookController.getBookById);
router.post('/create', auth, bookController.create);
router.post('/update/:id', auth, bookController.update);
router.get('/delete/:id', auth, bookController.delete);

module.exports = router;