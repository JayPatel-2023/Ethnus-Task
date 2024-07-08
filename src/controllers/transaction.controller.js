const Product = require('../models/product.model');

exports.listTransactions = async (req, res) => {
    const { page = 1, perPage = 10, month } = req.query;
    const query = {};

    if (month) {
        // Construct query to match month of sale regardless of year
        query.$expr = {
            $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
        };
    }

    let searchQuery = {};
    const { search } = req.query;
    if (search) {
        searchQuery = {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: parseFloat(search) || 0 }
            ]
        };
    }

    try {
        const transactions = await Product.find({
            ...query,
            ...searchQuery
        })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ dateOfSale: -1 })
        .exec();

        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};