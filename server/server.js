require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const authRouter= require('./routes/auth/auth-routes')
const adminProductsRouter=require('./routes/admin/products-routes')
const shopProductsRouter=require('./routes/shop/products-routes')
const  shopCartRouter=require('./routes/shop/cart-routes')


mongoose.connect(
    "mongodb+srv://kratikasriwas:7736@cluster0.kfgxmo2.mongodb.net/"
)
.then(()=> console.log("MongoDB connected"))
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
app.use('/api/shop/products',shopProductsRouter);
app.use('/api/shop/cart',shopCartRouter);

//api/auth/register->registerUser controller in this way we will use it

app.listen(PORT,()=> console.log(`Server is now running on port ${PORT}`));