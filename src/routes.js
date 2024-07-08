const express = require('express');
const { seedDatabase } = require('./controllers/seedData.controller');
const { listTransactions } = require('./controllers/transaction.controller');
const { getMonthlyStatistics } = require('./controllers/statistics.controller');
const { getPriceRangeStats } = require('./controllers/barchart.controller');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Define the routes
router.get('/seed', seedDatabase);
router.get('/transactions',listTransactions);
router.get('/statistics', getMonthlyStatistics);
router.get('/price-range-stats', getPriceRangeStats);

module.exports = router; 
