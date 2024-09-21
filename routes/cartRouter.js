const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');  // Assuming you have a Product model
const auth = require('../middleware/authentication');   // Authentication middleware

const router = express.Router();

// Add product to cart
router.post('/add', auth, async (req, res) => {
    const { productId, quantity } = req.body;  // The productId and quantity from the request
    const userId = req.user.userId;            // Get userId from the JWT token

    try {
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if cart exists for this user
        let cart = await Cart.findOne({ userId });
        if (cart) {
            // Check if the product is already in the cart
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (productIndex > -1) {
                // If the product exists, update the quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // If the product doesn't exist, add it
                cart.products.push({ productId, quantity });
            }
        } else {
            // If no cart exists for the user, create a new cart
            cart = new Cart({
                userId,
                products: [{ productId, quantity }]
            });
        }

        // Save the cart to the database
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



// Get cart for the current user
router.get('/get', auth, async (req, res) => {
    const userId = req.user.userId;

    try {
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});






















// Update product quantity in the cart
router.put('/update', auth, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove product from cart
router.delete('/remove/:productId', auth, async (req, res) => {
    const productId = req.params.productId;
    const userId = req.user.userId;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

