const axios = require('axios');
const Product = require('../models/Product');

// Function to fetch data from the third-party API and seed the database
const seedDatabase = async (req, res) => {
    try {
        // Fetch data from the third-party API
        const response = await axios.get(process.env.AWS_URL);
        const products = response.data;

        // Clear existing data in the collection
        await Product.deleteMany();

        // Insert new data into the collection
        await Product.insertMany(products);

        // Send success response
        res.status(200).send('Database seeded successfully');
    } catch (err) {
        // Send error response
        res.status(500).send('Error seeding database');
    }
};

module.exports = { seedDatabase }; // Export the seedDatabase function
