const express = require('express');
const router = express.Router();
const database = require('../models/database');

// Get all products
router.get('/products', async (req, res) => {
    try {
        const productsCollection = database.db.collection('products');
        const products = await productsCollection.find({}).toArray();
        
        res.json({
            message: 'Products retrieved successfully',
            count: products.length,
            products: products
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const productId = database.getObjectId(req.params.id);
        const productsCollection = database.db.collection('products');
        
        const product = await productsCollection.findOne({ _id: productId });
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({
            message: 'Product retrieved successfully',
            product: product
        });
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;