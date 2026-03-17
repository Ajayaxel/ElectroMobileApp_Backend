const productService = require('../services/productService');

const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json({ status: true, data: products });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({ status: true, message: "Product created successfully", data: product });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        if (!product) return res.status(404).json({ status: false, message: "Product not found" });
        res.status(200).json({ status: true, message: "Product updated successfully", data: product });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await productService.deleteProduct(req.params.id);
        if (!product) return res.status(404).json({ status: false, message: "Product not found" });
        res.status(200).json({ status: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
