require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectToDB = require('./Config/db')
const { connectRedis } = require("./Config/redis");
const productRoutes = require('./Routes/ProductRoutes')
const userRoutes = require('./Routes/UserRoutes');
const orderRoutes = require('./Routes/OrderRoutes');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(bodyParser.json());
app.use('/', productRoutes);
app.use('/',userRoutes);
app.use('/', orderRoutes);
connectToDB();
connectRedis();

app.listen(PORT, ()=> {
    console.log("Server started");
})