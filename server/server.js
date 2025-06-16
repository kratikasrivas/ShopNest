const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const authRouter= require('./routes/auth/auth-routes')
const adminProductsRouter=require('./routes/admin/products-routes')



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
        methods:["GET","POST","DELETE","PUT"],
        allowedHeaders:[
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",

        ],
        credentials:true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRouter);
app.use('/api/admin/products',adminProductsRouter);


//api/auth/register->registerUser controller in this way we will use it

app.listen(PORT,()=> console.log(`Server is now running on port ${PORT}`));
