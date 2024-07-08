const Product = require('../models/product.model');
const getPriceRangeStats = async (req, res) => {
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
                $bucket: {
                    groupBy: "$price",
                    boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901],
                    default: "901-above",
                    output: {
                        count: { $sum: 1 }
                    }
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
            {
                $sort: { "_id": 1 }
            }
        ]);

        // Ensure all ranges are present in the response
        const ranges = [
            "0 - 100", "101 - 200", "201 - 300", "301 - 400", "401 - 500",
            "501 - 600", "601 - 700", "701 - 800", "801 - 900", "901 - above"
        ];

        const filledResult = ranges.map(range => {
            const found = result.find(item => item.range === range);
            return found || { range, count: 0 };
        });

        res.json(filledResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getPriceRangeStats }