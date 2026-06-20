const express = require('express');
const Motorcycle = require('../models/nosql/Motorcycle');
const { createAssetController } = require('../controllers/createAssetController');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { motorcycleSchema, updateMotorcycleSchema } = require('../validators/motorcycleValidator');

const router = express.Router();
const controller = createAssetController(Motorcycle, 'Moto');

router.use(authenticate);
router.get('/', controller.list);
router.post('/', validate(motorcycleSchema), controller.create);
router.get('/:id', controller.getById);
router.put('/:id', validate(updateMotorcycleSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
