import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './routes/auth.js';
import userRoute from "./routes/users.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/orders.js";
import cartRoute from "./routes/cart.js";
import * as errorHandler from './middleware/errorHandler.js';
import * as Sentry from '@sentry/node';

dotenv.config();

// Initialize Sentry
// https://docs.sentry.io/platforms/node/express/
Sentry.init({ dsn: process.env.SENTRY_DSN });

const PORT = process.env.PORT || 3000;
const app = express();

// This request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

mongoose
.connect(process.env.MONGO_DB_URL, { dbName: "ecommerce" })
.then(() => {
  console.log("The connection is Successful!!");
})
.catch((err) => {
  console.log(err);
});

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api", userRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);
app.use("/api", cartRoute);

// Error Middleware
// This error handler must be before any other error middleware
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler.genericErrorHandler);


app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
