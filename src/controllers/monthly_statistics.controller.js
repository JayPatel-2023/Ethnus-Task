const Product = require('../models/product.model');

const getMonthlyStatistics = async (req, res) => {
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
                    _id: null,
                    totalSaleAmount: {
                        $sum: {
                            $cond: [{ $eq: ["$sold", true] }, "$price", 0]
                        }
                    },
                    soldItems: {
                        $sum: {
                            $cond: [{ $eq: ["$sold", true] }, 1, 0]
                        }
                    },
                    unsoldItems: {
                        $sum: {
                            $cond: [{ $eq: ["$sold", false] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const statistics = result[0] || {
            totalSaleAmount: 0,
            soldItems: 0,
            unsoldItems: 0
        };

        res.json({
            totalSaleAmount: statistics.totalSaleAmount,
            soldItems: statistics.soldItems,
            unsoldItems: statistics.unsoldItems
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getMonthlyStatistics }