const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/authentication');

const router = express.Router();

// Add a new product (Admin only)
router.post('/postproduct', auth, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all products
router.get('/getproduct', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
