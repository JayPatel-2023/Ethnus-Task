const express = require('express');
const connectDB = require('./database');
const routes = require('./routes');

const app = express();

// Connect to the MongoDB database
connectDB();

// Use routes defined in routes.js
app.use('/api', routes);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
