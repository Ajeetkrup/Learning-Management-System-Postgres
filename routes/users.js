const express = require('express');
const userController = require('../controllers/userController');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, userController.getUsers);

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/generate/accessToken', userController.accessToken);
router.post('/generate/refreshToken', userController.refreshToken);

router.get('/:id',auth, userController.getUserById);
router.post('/create', auth, userController.create);
router.post('/update/:id', auth, userController.update);
router.get('/delete/:id', auth, userController.delete);

module.exports = router;