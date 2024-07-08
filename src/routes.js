const express = require('express');
const { seedDatabase } = require('./controllers/seed_db.controller');
const { listTransactions } = require('./controllers/list_transactions.controller');
const { getMonthlyStatistics } = require('./controllers/monthly_statistics.controller');
const { getPriceRangeStats } = require('./controllers/price_range_stats.controller');
const { getCategoryStats } = require('./controllers/category_stats.controller');
const { getCombinedStats } = require('./controllers/combined_stats.controller');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Define the routes
router.get('/seed', seedDatabase);
router.get('/transactions',listTransactions);
router.get('/monthly-stats', getMonthlyStatistics);
router.get('/price-range-stats', getPriceRangeStats);
router.get('/category-stats', getCategoryStats);
router.get('/combined-stats', getCombinedStats);

module.exports = router; 
