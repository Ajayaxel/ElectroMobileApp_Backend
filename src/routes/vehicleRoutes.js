const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const vehicleBrandController = require('../controllers/vehicleBrandController');
const vehicleTypeController = require('../controllers/vehicleTypeController');

// Vehicle routes (Public)
router.get('/brands', vehicleController.getVehicleBrands);
router.get('/model-types', vehicleTypeController.getVehicleTypes);
router.get('/models', vehicleController.getVehicleModels);

// Admin routes for brands
router.post('/brands', vehicleBrandController.createVehicleBrand);
router.put('/brands/:id', vehicleBrandController.updateVehicleBrand);
router.delete('/brands/:id', vehicleBrandController.deleteVehicleBrand);

// Admin routes for types
router.get('/admin/types', vehicleTypeController.adminGetVehicleTypes);
router.post('/types', vehicleTypeController.createVehicleType);
router.put('/types/:id', vehicleTypeController.updateVehicleType);
router.delete('/types/:id', vehicleTypeController.deleteVehicleType);

// Admin routes for models (should be protected in production)
router.post('/models', vehicleController.createVehicleModel);
router.put('/models/:id', vehicleController.updateVehicleModel);
router.delete('/models/:id', vehicleController.deleteVehicleModel);

module.exports = router;
