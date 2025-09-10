const express = require('express');
const router = express.Router();
const database = require('../models/database');

// Add new product
router.post('/products', async (req, res) => {
    try {
        const { id, name, description, price, units } = req.body;
        
        // Validation
        if (!id || !name || !description || !price || !units) {
            return res.status(400).json({ 
                error: 'All fields are required: id, name, description, price, units' 
            });
        }
        
        if (name.length > 50) {
            return res.status(400).json({ error: 'Name cannot exceed 50 characters' });
        }
        
        if (description.length > 255) {
            return res.status(400).json({ error: 'Description cannot exceed 255 characters' });
        }
        
        // Check for duplicate ID
        const existingProduct = await database.db.collection('products').findOne({ id: parseInt(id) });
        if (existingProduct) {
            return res.status(400).json({ error: 'Product with this ID already exists' });
        }
        
        const product = {
            id: parseInt(id),
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(price).toFixed(2),
            units: parseInt(units),
            createdAt: new Date()
        };
        
        const result = await database.db.collection('products').insertOne(product);
        
        res.status(201).json({
            message: 'Product added successfully',
            product: product,
            insertedId: result.insertedId
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add multiple products (for initial setup)
router.post('/add-products', async (req, res) => {
    try {
        const productsCollection = database.db.collection('products');
        
        const products = [
            {
                id: 1,
                name: "Laptop",
                description: "High-performance gaming laptop with 16GB RAM and RTX 3060",
                price: 1299.99,
                units: 15,
                createdAt: new Date()
            },
            {
                id: 2,
                name: "Smartphone",
                description: "Latest smartphone with 5G capability and 128GB storage",
                price: 899.99,
                units: 30,
                createdAt: new Date()
            },
            {
                id: 3,
                name: "Headphones",
                description: "Wireless noise-cancelling headphones with 30-hour battery",
                price: 249.99,
                units: 50,
                createdAt: new Date()
            }
        ];
        
        const result = await productsCollection.insertMany(products);
        res.json({
            message: 'Products added successfully',
            insertedCount: result.insertedCount,
            products: products
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;