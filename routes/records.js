const express = require('express');
const recordController = require('../controllers/recordController');

const router = express.Router();

router.get('/', recordController.getRecords);
router.get('/:id', recordController.getRecordById);
router.post('/create', recordController.create);
router.post('/update/:id', recordController.update);
router.get('/delete/:id', recordController.delete);

module.exports = router;