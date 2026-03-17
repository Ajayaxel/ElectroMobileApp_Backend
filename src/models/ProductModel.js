const mongoose = require('mongoose');
const Counter = require('./CounterModel');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    image: {
        type: String, // main/thumbnail image
        required: [true, 'Image URL is required'],
    },
    images: {
        type: [String], // array of image urls
        default: [],
    },
    warranty: {
        type: String,
        default: 'Not specified',
    },
    capacity: {
        type: String,
        default: 'Not specified',
    },
    voltage: {
        type: String,
        default: 'Not specified',
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        default: 10,
    },
    is_favorite: {
        type: Boolean,
        default: false,
    },
    in_cart_count: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
        required: [true, 'Category type is required'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

productSchema.pre('save', async function () {
    const product = this;
    if (product.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: 'product_id' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        product.id = counter.seq;
    }
});

module.exports = mongoose.model('Product', productSchema);
