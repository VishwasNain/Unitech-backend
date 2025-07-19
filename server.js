const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const fs = require('fs');
const colors = require('colors'); // Console colors

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const newsletterRoutes = require('./routes/newsletter');

// Import middleware
const errorMiddleware = require('./middleware/error');

// Initialize express app
const app = express();

// Security middlewares
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 10 minutes'
});
app.use(limiter);

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Basic middlewares
app.use(express.json());
app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorMiddleware);

// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    const connectionString = process.env.MONGO_URI || process.env.MONGODB_URI;

    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`.cyan.underline.bold);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`.red);
    process.exit(1);
  }
};

// Start server after DB is connected
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`💥 Unhandled Rejection: ${err.message}`.red);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error(`💥 Uncaught Exception: ${err.message}`.red);
    server.close(() => process.exit(1));
  });

  // Handle SIGTERM
  process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('Process terminated!');
    });
  });
});
