const express = require('express');
const { seedDatabase } = require('./controllers/seedData.controller');
const { listTransactions } = require('./controllers/transaction.controller');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Define the routes
router.get('/seed', seedDatabase);
router.get('/transactions',listTransactions);

module.exports = router; 
