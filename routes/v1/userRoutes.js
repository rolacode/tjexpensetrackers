const express = require('express');
const { 
  createUserHandler, 
  getUserHandler,
  updateUserHandler, 
  loginUserHandler,
  deleteUserHandler, 
} = require('../../controllers/v1/userController');
const validateToken = require('../../middleware/auth');

const router = express.Router();

router.post('', createUserHandler);
router.get('/:id', validateToken, getUserHandler);
router.put('/:id', validateToken, updateUserHandler);
router.post('/login', loginUserHandler);
router.delete('/:id', validateToken, deleteUserHandler);

module.exports = router;