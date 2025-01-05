# API Gateway

The **API Gateway** is the central entry point for client requests in the microservices architecture of the multi-vendor platform. It efficiently routes client requests to the appropriate microservices, handles authentication, and ensures secure communication.

## Features
- **Centralized Routing:** Redirects client requests to the respective services (Authentication, Product, Order, Notification).
- **Authentication:** Secures routes using JSON Web Tokens (JWT).
- **Error Handling:** Captures proxy and service errors, providing consistent client responses.
- **Environment Configurations:** Uses environment variables for service URLs to maintain flexibility and security.

## Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building the API Gateway.
- **http-proxy**: Middleware for proxying client requests to microservices.
- **dotenv**: Manages environment variables securely.

## Prerequisites
- Node.js installed (v16.x or above).
- Environment variables configured in a `.env` file.


## Setup and Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Brown-scripts/vendobuyo_api_gateway.git
   cd vendobuyo_api_gateway
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file as described.
   - Update service URLs as per your setup.

4. Start the server:
   ```bash
   npm start
   ```

   The API Gateway will be available at `http://localhost:3000`.

## Usage
The API Gateway routes requests to specific services:

- **Authentication Service:** `/api/auth`
- **Product Service:** `/api/products`
- **Order Service:** `/api/orders`
- **Notification Service:** `/api/notifications`

For example:
- `POST /api/auth/register`: Registers a new user.
- `GET /api/products`: Retrieves a list of products.
- `POST /api/orders`: Places an order.
- `POST /api/notifications`: Sends a notification.

## Middleware
1. **Authentication Middleware**: Ensures requests to protected routes are authenticated.
2. **Error Handler Middleware**: Manages errors and sends consistent responses to the client.

## Error Handling
The API Gateway captures and handles errors at two levels:
1. Proxy Errors: If a service is unreachable, it logs the error and returns a 500 response.
2. General Errors: Handles other application-level errors consistently.

## Contribution
Feel free to contribute to enhance the functionality:
1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request for review.

## License
This project is licensed under the [MIT License](LICENSE).
