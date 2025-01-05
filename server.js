const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
app.use(cors());

// Service URLs from environment variables
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004';

// Debug helper function
function debugRequest(req, serviceName, targetUrl) {
  console.log(`[DEBUG] Incoming request to ${req.originalUrl}`);
  console.log(`[DEBUG] Method: ${req.method}`);
  console.log(`[DEBUG] Headers:`, JSON.stringify(req.headers, null, 2));
  console.log(`[DEBUG] Body:`, req.body);
  console.log(`[DEBUG] Forwarding to ${serviceName} at ${targetUrl}${req.url}`);
}

// Proxy configuration object
const proxyConfig = (serviceName, targetUrl) => ({
  target: targetUrl,
  changeOrigin: true, // Ensure Host header matches the target
  on: {
    proxyReq: (proxyReq, req) => {
      console.log(`[DEBUG] Proxying request to ${serviceName}: ${targetUrl}${req.url}`);
    },
    proxyRes: (proxyRes, req, res) => {
      console.log(`[DEBUG] Response from ${serviceName} for ${req.url} - Status: ${proxyRes.statusCode}`);
    },
    error: (err, req, res) => {
      console.error(`[ERROR] Error occurred while proxying to ${serviceName}: ${err.message}`);
    },
  },
});

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Hello from Vendobuyo API!' });
});

// Proxy requests to Auth Service
app.use(
  '/api/auth',
  (req, res, next) => {
    debugRequest(req, 'Auth Service', AUTH_SERVICE_URL);
    next();
  },
  createProxyMiddleware(proxyConfig('Auth Service', AUTH_SERVICE_URL))
);

// Proxy requests to Product Service
app.use(
  '/api/products',
  authenticateToken,
  (req, res, next) => {
    debugRequest(req, 'Product Service', PRODUCT_SERVICE_URL);
    next();
  },
  createProxyMiddleware(proxyConfig('Product Service', PRODUCT_SERVICE_URL))
);

// Proxy requests to Order Service
app.use(
  '/api/orders',
  authenticateToken,
  (req, res, next) => {
    debugRequest(req, 'Order Service', ORDER_SERVICE_URL);
    next();
  },
  createProxyMiddleware(proxyConfig('Order Service', ORDER_SERVICE_URL))
);

// Proxy requests to Notification Service
app.use(
  '/api/notifications',
  authenticateToken,
  (req, res, next) => {
    debugRequest(req, 'Notification Service', NOTIFICATION_SERVICE_URL);
    next();
  },
  createProxyMiddleware(proxyConfig('Notification Service', NOTIFICATION_SERVICE_URL))
);

// Default error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

// General error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[INFO] API Gateway running on port ${PORT}`);
});
