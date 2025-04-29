const express = require('express');
const watchOrderChanges = require('./watchOrders');

const app = express();

// Simple endpoint just to respond to health checks
app.get('/', (req, res) => {
  res.send('🚀 Notification Service is running!');
});

// Start watching MongoDB changes
const startServer = async () => {
  await watchOrderChanges();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};

startServer();
