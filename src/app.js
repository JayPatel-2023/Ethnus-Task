const express = require('express');
const connectDB = require('./database');
const routes = require('./routes');

const app = express();

// Connect to MongoDB
connectDB();

// Define routes
app.use('/api/v1', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
