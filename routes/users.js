const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/create', userController.create);
router.post('/update/:id', userController.update);
router.get('/delete/:id', userController.delete);

module.exports = router;