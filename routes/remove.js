const express = require('express');
const router = express.Router();
const database = require('../models/database');

// Delete product by MongoDB _id
router.delete('/products/:id', async (req, res) => {
    try {
        const productId = database.getObjectId(req.params.id);
        const productsCollection = database.db.collection('products');
        
        const result = await productsCollection.deleteOne({ _id: productId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({
            message: 'Product deleted successfully',
            deletedCount: result.deletedCount
        });
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;