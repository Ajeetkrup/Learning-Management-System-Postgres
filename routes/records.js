const express = require('express');
const recordController = require('../controllers/recordController');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, recordController.getRecords);
router.get('/:id', auth, recordController.getRecordById);
router.post('/create', auth, recordController.create);
router.post('/update/:id', auth, recordController.update);
router.get('/delete/:id', auth, recordController.delete);

module.exports = router;