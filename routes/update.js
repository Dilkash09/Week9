const express = require('express');
const router = express.Router();
const database = require('../models/database');

// Update product by MongoDB _id
router.put('/products/:id', async (req, res) => {
    try {
        const productId = database.getObjectId(req.params.id);
        const { name, description, price, units } = req.body;
        
        // Validation
        if (name && name.length > 50) {
            return res.status(400).json({ error: 'Name cannot exceed 50 characters' });
        }
        
        if (description && description.length > 255) {
            return res.status(400).json({ error: 'Description cannot exceed 255 characters' });
        }
        
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (description) updateData.description = description.trim();
        if (price) updateData.price = parseFloat(price).toFixed(2);
        if (units) updateData.units = parseInt(units);
        updateData.updatedAt = new Date();
        
        const productsCollection = database.db.collection('products');
        const result = await productsCollection.updateOne(
            { _id: productId },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({
            message: 'Product updated successfully',
            modifiedCount: result.modifiedCount
        });
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;