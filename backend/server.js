require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectToDB = require('./Config/db')
const { connectRedis } = require("./Config/redis");
const productRoutes = require('./Routes/ProductRoutes')
const userRoutes = require('./Routes/UserRoutes');
const orderRoutes = require('./Routes/OrderRoutes');


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/', productRoutes);
app.use('/',userRoutes);
app.use('/', orderRoutes);
connectToDB();
connectRedis();

app.listen(5000, ()=> {
    console.log("Server started");
})