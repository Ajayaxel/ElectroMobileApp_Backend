const categoryService = require('../services/categoryService');
const productService = require('../services/productService');
const Order = require('../models/OrderModel');
const User = require('../models/userModel');

const getHomeData = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        const products = await productService.getAllProducts();
        const orders = await Order.find();
        const totalCustomers = await User.countDocuments({ role: 'user' });

        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'Pending').length;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        // Group products into sections based on category types
        const sections = categories.map(category => {
            const items = products.filter(product => product.type === category.type);
            return {
                title: `Popular ${category.name} Batteries`,
                type: category.type,
                items: items
            };
        });

        const totalCarted = products.reduce((sum, p) => sum + (p.in_cart_count || 0), 0);

        res.status(200).json({
            status: true,
            message: "Home data fetched successfully",
            data: {
                categories: categories,
                sections: sections,
                total_carted: totalCarted,
                total_customers: totalCustomers,
                total_orders: totalOrders,
                pending_orders: pendingOrders,
                total_revenue: totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    getHomeData,
};
