const VehicleBrand = require('../models/VehicleBrandModel');
const VehicleModel = require('../models/VehicleModel');
const UserVehicle = require('../models/UserVehicleModel');

// @desc    Get all active vehicle brands
// @route   GET /api/vehicles/brands
// @access  Public
exports.getVehicleBrands = async (req, res) => {
    try {
        const brands = await VehicleBrand.find({ status: 'active' }).sort({ name: 1 });
        
        // Map to requested format
        const formattedBrands = brands.map(brand => ({
            id: brand.id,
            name: brand.name,
            logo: brand.image,
            image: brand.image 
        }));

        res.status(200).json({
            success: true,
            message: "Brands fetched successfully",
            data: formattedBrands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get vehicle model types
// @route   GET /api/vehicles/model-types
// @access  Public
exports.getVehicleModelTypes = async (req, res) => {
    try {
        const types = [
            { id: "sedan", name: "Sedan" },
            { id: "suv", name: "SUV" }
        ];
        res.status(200).json({
            success: true,
            message: "Model types fetched successfully",
            data: types
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get vehicle models by brand and type
// @route   GET /api/vehicles/models
// @access  Public
exports.getVehicleModels = async (req, res) => {
    try {
        const { brand_id, type } = req.query;
        let query = { status: 'active' };
        
        if (brand_id) query.brand_id = parseInt(brand_id);
        if (type) query.type = type;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await VehicleModel.countDocuments(query);
        const models = await VehicleModel.find(query).skip(skip).limit(limit).sort({ name: 1 });

        // Map to requested format
        const formattedModels = models.map(m => ({
            id: m.id,
            brand_id: m.brand_id,
            name: m.name,
            image: m.image,
            type: m.type
        }));

        res.status(200).json({
            success: true,
            message: "Models fetched successfully",
            data: formattedModels,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Add user vehicle
// @route   POST /api/user/vehicles
// @access  Private (Logged in user)
exports.addUserVehicle = async (req, res) => {
    try {
        const { user_id, brand_id, model_id, vehicle_type, country, emirate, plate_code, plate_number } = req.body;

        // 1. Check if brand exists
        const brand = await VehicleBrand.findOne({ id: brand_id });
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        // 2. Check if model exists and belongs to brand and type matches
        const model = await VehicleModel.findOne({ id: model_id, brand_id });
        if (!model) {
            return res.status(404).json({
                success: false,
                message: "Model not found for this brand"
            });
        }

        if (model.type !== vehicle_type) {
             return res.status(400).json({
                success: false,
                message: `Type mismatch. Selected model is a ${model.type}, but you specified ${vehicle_type}.`
            });
        }

        const userVehicle = await UserVehicle.create({
            user_id,
            brand_id,
            model_id,
            vehicle_type,
            country,
            emirate,
            plate_code,
            plate_number
        });

        res.status(201).json({
            success: true,
            message: "Vehicle added successfully",
            data: userVehicle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get user vehicles
// @route   GET /api/user/vehicles
// @access  Private (Logged in user)
exports.getUserVehicles = async (req, res) => {
    try {
        const { user_id } = req.query; // in real app, get from auth token
        const userVehicles = await UserVehicle.find({ user_id });
        
        // Populate brand and model info (manual population if needed, or use $lookup)
        const detailedVehicles = await Promise.all(userVehicles.map(async (uv) => {
            const brand = await VehicleBrand.findOne({ id: uv.brand_id });
            const model = await VehicleModel.findOne({ id: uv.model_id });
            return {
                ...uv.toObject(),
                brand_name: brand ? brand.name : 'Unknown',
                brand_logo: brand ? brand.image : null,
                model_name: model ? model.name : 'Unknown',
                model_image: model ? model.image : null
            };
        }));

        res.status(200).json({
            success: true,
            message: "User vehicles fetched successfully",
            data: detailedVehicles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Remove user vehicle
// @route   DELETE /api/user/vehicles/:id
// @access  Private (Logged in user)
exports.removeUserVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const userVehicle = await UserVehicle.findOneAndDelete({ id: parseInt(id) });
        
        if (!userVehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle removed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Admin Endpoints for models
exports.createVehicleModel = async (req, res) => {
    try {
        const model = await VehicleModel.create(req.body);
        res.status(201).json({
            success: true,
            data: model
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create model',
            error: error.message
        });
    }
};

exports.updateVehicleModel = async (req, res) => {
    try {
        const model = await VehicleModel.findOneAndUpdate({ id: req.params.id }, req.body, {
            returnDocument: 'after',
            runValidators: true,
        });
        if (!model) return res.status(404).json({ success: false, message: 'Model not found' });
        res.status(200).json({ success: true, data: model });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error updating model', error: error.message });
    }
};

exports.deleteVehicleModel = async (req, res) => {
    try {
        const model = await VehicleModel.findOneAndDelete({ id: req.params.id });
        if (!model) return res.status(404).json({ success: false, message: 'Model not found' });
        res.status(200).json({ success: true, message: 'Model deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting model', error: error.message });
    }
};
