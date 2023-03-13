const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.get('/', paymentController.getPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/create', paymentController.create);
router.post('/update/:id', paymentController.update);
router.get('/delete/:id', paymentController.delete);

module.exports = router;