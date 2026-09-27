require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const authRouter= require('./routes/auth/auth-routes')
const adminProductsRouter=require('./routes/admin/products-routes')
const adminOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter=require('./routes/shop/products-routes')
const  shopCartRouter=require('./routes/shop/cart-routes')
const shopAddressRouter=require("./routes/shop/address-routes")
const shopOrderRouter=require("./routes/shop/order-routes")
const shopSearchRouter = require("./routes/shop/search-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const Order = require("./models/Order");

mongoose.connect(
    process.env.MONGO_URI
)
.then(async () => {
    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.name);
    // console.log("Database:", mongoose.connection.name);
    // console.log("Collections:", Object.keys(mongoose.connection.collections));
    // const orders = await Order.find({}).sort({ orderDate: -1 });

    // console.log("Number of orders:", orders.length);
    // console.log("Latest orders:", orders.slice(0, 5));
    
})
.catch((error)=> console.log(error));

const app=express();
const PORT=process.env.PORT || 5000;
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
        exposedHeaders: ['Cache-Control']
    })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRouter);
app.use('/api/admin/products',adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use('/api/shop/products',shopProductsRouter);
app.use('/api/shop/cart',shopCartRouter);
app.use('/api/shop/address',shopAddressRouter);
app.use('/api/shop/order',shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/shop/review", shopReviewRouter);

//api/auth/register->registerUser controller in this way we will use it

app.listen(PORT,()=> console.log(`Server is now running on port ${PORT}`));