const express = require('express');
const ClothingBrand = require('../models/nosql/ClothingBrand');
const { createAssetController } = require('../controllers/createAssetController');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { clothingBrandSchema, updateClothingBrandSchema } = require('../validators/clothingBrandValidator');

const router = express.Router();
const controller = createAssetController(ClothingBrand, 'Marca de roupa');

router.use(authenticate);
router.get('/', controller.list);
router.post('/', validate(clothingBrandSchema), controller.create);
router.get('/:id', controller.getById);
router.put('/:id', validate(updateClothingBrandSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
