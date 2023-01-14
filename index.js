import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './routes/auth.js';
import userRoute from "./routes/users.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/orders.js";
import cartRoute from "./routes/cart.js";

const PORT = process.env.PORT || 3000;
dotenv.config();
const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_DB_URL, { dbName: "ecommerce" })
  .then(() => {
    console.log("The connection is Successful!!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRoute);
app.use("/api", userRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);
app.use("/api", cartRoute);


app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
