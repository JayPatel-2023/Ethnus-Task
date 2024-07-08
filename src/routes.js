const express = require('express');
const { seedDatabase } = require('./controllers/seedData');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Define the /seed route
router.get('/seed', seedDatabase);

module.exports = router; // Export the router
