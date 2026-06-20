const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize, authorizeSelfOrAdmin } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createUserSchema, updateUserSchema } = require('../validators/userValidator');

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('admin'), userController.listUsers);
router.post('/', authorize('admin'), validate(createUserSchema), userController.createUser);
router.get('/:id', authorizeSelfOrAdmin('id'), userController.getUser);
router.put('/:id', authorizeSelfOrAdmin('id'), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;
