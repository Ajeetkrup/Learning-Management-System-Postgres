const express = require('express');
const paymentController = require('../controllers/paymentController');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, paymentController.getPayments);
router.get('/:id', auth, paymentController.getPaymentById);
router.post('/create', auth, paymentController.create);
router.post('/update/:id', auth, paymentController.update);
router.get('/delete/:id', auth, paymentController.delete);

module.exports = router;