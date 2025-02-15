const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    productId: String,
    productName: String,
    description: String,
    price: Number,
    dateOfSale: Date
});

module.exports = mongoose.model('Transaction', TransactionSchema);
