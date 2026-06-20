const express = require('express');
const Car = require('../models/nosql/Car');
const { createAssetController } = require('../controllers/createAssetController');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { carSchema, updateCarSchema } = require('../validators/carValidator');

const router = express.Router();
const controller = createAssetController(Car, 'Carro');

router.use(authenticate);
router.get('/', controller.list);
router.post('/', validate(carSchema), controller.create);
router.get('/:id', controller.getById);
router.put('/:id', validate(updateCarSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
