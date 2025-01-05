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

// Proxy requests to Auth Service
app.use(
  '/api/auth',
  (req, res, next) => {
    debugRequest(req, 'Auth Service', AUTH_SERVICE_URL);
    next();
  },
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true, // Ensure Host header matches the target
    onProxyReq: (proxyReq, req) => {
      console.log(`[DEBUG] Proxying request to Auth Service: ${AUTH_SERVICE_URL}${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[DEBUG] Response from Auth Service for ${req.url} - Status: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error(`[ERROR] Error occurred while proxying to Auth Service: ${err.message}`);
    },
  })
);

// Proxy requests to Product Service
app.use(
  '/api/products',
  authenticateToken,
  (req, res, next) => {
    debugRequest(req, 'Product Service', PRODUCT_SERVICE_URL);
    next();
  },
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      console.log(`[DEBUG] Proxying request to Product Service: ${PRODUCT_SERVICE_URL}${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[DEBUG] Response from Product Service for ${req.url} - Status: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error(`[ERROR] Error occurred while proxying to Product Service: ${err.message}`);
    },
  })
);

// Proxy requests to Order Service
app.use(
  '/api/orders',
  authenticateToken,
  (req, res, next) => {
    debugRequest(req, 'Order Service', ORDER_SERVICE_URL);
    next();
  },
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      console.log(`[DEBUG] Proxying request to Order Service: ${ORDER_SERVICE_URL}${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[DEBUG] Response from Order Service for ${req.url} - Status: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error(`[ERROR] Error occurred while proxying to Order Service: ${err.message}`);
    },
  })
);

// Proxy requests to Notification Service
app.use(
  '/api/notifications',
  authenticateToken,
  (req, res, next) => {
    debugRequest(req, 'Notification Service', NOTIFICATION_SERVICE_URL);
    next();
  },
  createProxyMiddleware({
    target: NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      console.log(`[DEBUG] Proxying request to Notification Service: ${NOTIFICATION_SERVICE_URL}${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[DEBUG] Response from Notification Service for ${req.url} - Status: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error(`[ERROR] Error occurred while proxying to Notification Service: ${err.message}`);
    },
  })
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