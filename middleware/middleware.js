const express = require('express');
const router = express.Router();
const UserController = require('../controllers/controller'); // Import your user controller functions

// Define routes and associate them with controller functions
router.post('/register', UserController.register);
router.post('/signin', UserController.signin);
router.get('/login', UserController.authenticateToken, UserController.login);
router.get('/users/list', UserController.authenticateToken, UserController.getAll);
router.get('/users/id', UserController.authenticateToken, UserController.getById);
router.get('/users/journey', UserController.authenticateToken, UserController.getByJourney);
router.put('/update', UserController.authenticateToken, UserController.updateById);
router.delete('/delete', UserController.authenticateToken, UserController.deleteById);

module.exports = router;