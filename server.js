if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 8080;

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Health check - ADD BEFORE LISTEN
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start server
(async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
    });
    
    process.on('SIGTERM', () => {
      console.log('Shutting down gracefully');
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error('Server start failed:', error);
    process.exit(1);
  }
})();
