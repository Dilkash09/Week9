const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require('./models/database');

// Import route files
const addRoutes = require('./routes/add');
const removeRoutes = require('./routes/remove');
const updateRoutes = require('./routes/update');
const readRoutes = require('./routes/read');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database and routes
async function initializeServer() {
    try {
        await database.connect();
        
        // Set up routes
        app.use('/api', addRoutes);
        app.use('/api', removeRoutes);
        app.use('/api', updateRoutes);
        app.use('/api', readRoutes);
        
        // Default route
        app.get('/', (req, res) => {
            res.json({ message: 'Product Management API is running!' });
        });
        
        // Start server
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
        
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

initializeServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await database.close();
    process.exit(0);
});