const Product = require('../models/ProductModel');

const getAllProducts = async () => {
    return await Product.find().select('-__v -_id');
};

const getProductsByType = async (type) => {
    return await Product.find({ type }).select('-__v -_id');
};

const getProductById = async (id) => {
    return await Product.findOne({ id }).select('-__v -_id');
};

const createProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

const updateProduct = async (id, updateData) => {
    return await Product.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true }).select('-__v -_id');
};

const deleteProduct = async (id) => {
    return await Product.findOneAndDelete({ id });
};

module.exports = {
    getAllProducts,
    getProductsByType,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
