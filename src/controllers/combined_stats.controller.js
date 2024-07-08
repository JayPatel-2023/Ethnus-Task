const Product = require('../models/product.model');

// Monthly Statistics function
const getMonthlyStatistics = async (req, res) => {
    const { month } = req.query;
    try {
        const result = await Product.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSaleAmount: {
                        $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] }
                    },
                    soldItems: {
                        $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] }
                    },
                    unsoldItems: {
                        $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] }
                    }
                }
            }
        ]);
        return result[0] || { totalSaleAmount: 0, soldItems: 0, unsoldItems: 0 };
    } catch (err) {
        console.error(err);
        return { error: 'Error fetching monthly statistics' };
    }
};

// Price Range Statistics function
const getPriceRangeStats = async (req, res) => {
    const { month } = req.query;
    try {
        const result = await Product.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
                }
            },
            {
                $bucket: {
                    groupBy: "$price",
                    boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901],
                    default: "901-above",
                    output: { count: { $sum: 1 } }
                }
            },
            {
                $project: {
                    range: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id", 0] }, then: "0 - 100" },
                                { case: { $eq: ["$_id", 101] }, then: "101 - 200" },
                                { case: { $eq: ["$_id", 201] }, then: "201 - 300" },
                                { case: { $eq: ["$_id", 301] }, then: "301 - 400" },
                                { case: { $eq: ["$_id", 401] }, then: "401 - 500" },
                                { case: { $eq: ["$_id", 501] }, then: "501 - 600" },
                                { case: { $eq: ["$_id", 601] }, then: "601 - 700" },
                                { case: { $eq: ["$_id", 701] }, then: "701 - 800" },
                                { case: { $eq: ["$_id", 801] }, then: "801 - 900" },
                            ],
                            default: "901 - above"
                        }
                    },
                    count: 1
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        return result;
    } catch (err) {
        console.error(err);
        return { error: 'Error fetching price range statistics' };
    }
};

// Category Statistics function
const getCategoryStats = async (req, res) => {
    const { month } = req.query;
    try {
        const result = await Product.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
                }
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    category: "$_id",
                    count: 1,
                    _id: 0
                }
            },
            { $sort: { count: -1 } }
        ]);
        return result;
    } catch (err) {
        console.error(err);
        return { error: 'Error fetching category statistics' };
    }
};

// Combined Statistics function
const getCombinedStats = async (req, res) => {
    const { month } = req.query;

    if (!month || isNaN(parseInt(month)) || parseInt(month) < 1 || parseInt(month) > 12) {
        return res.status(400).json({ message: 'Invalid month parameter. Please provide a number between 1 and 12.' });
    }

    try {
        const monthlyStats = await getMonthlyStatistics(req);
        const priceRangeStats = await getPriceRangeStats(req);
        const categoryStats = await getCategoryStats(req);

        const combinedStats = {
            monthlyStats,
            priceRangeStats,
            categoryStats
        };

        res.json(combinedStats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getCombinedStats }