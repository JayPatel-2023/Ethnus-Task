const Product = require('../models/product.model');

const getCategoryStats = async (req, res) => {
    const { month } = req.query;

    if (!month || isNaN(parseInt(month)) || parseInt(month) < 1 || parseInt(month) > 12) {
        return res.status(400).json({ message: 'Invalid month parameter. Please provide a number between 1 and 12.' });
    }

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
            {
                $sort: { count: -1 }
            }
        ]);

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getCategoryStats }