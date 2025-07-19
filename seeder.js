const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Newsletter = require('./models/Newsletter');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8')
);

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/data/products.json`, 'utf-8')
);

const orders = JSON.parse(
  fs.readFileSync(`${__dirname}/data/orders.json`, 'utf-8')
);

const newsletter = JSON.parse(
  fs.readFileSync(`${__dirname}/data/newsletter.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Product.create(products);
    await Order.create(orders);
    await Newsletter.create(newsletter);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Newsletter.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
