const express = require('express');
const {register, login, verifyToken} = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Token verification route - protected with your existing auth middleware
router.get('/verify-token', auth, verifyToken);

module.exports = router;