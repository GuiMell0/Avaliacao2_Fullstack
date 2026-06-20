const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const carRoutes = require('./carRoutes');
const motorcycleRoutes = require('./motorcycleRoutes');
const clothingBrandRoutes = require('./clothingBrandRoutes');
const { health } = require('../controllers/healthController');

const router = express.Router();

router.get('/api/health', health);
router.use('/api/auth', authRoutes);
router.use('/api/usuarios', userRoutes);
router.use('/api/carros', carRoutes);
router.use('/api/motos', motorcycleRoutes);
router.use('/api/marcas-roupa', clothingBrandRoutes);

module.exports = router;
