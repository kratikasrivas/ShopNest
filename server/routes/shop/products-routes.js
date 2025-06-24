

const express=require('express');

const {getFiltereredProducts, getProductDetails}=require('../../controllers/shop/products-controller');


const router=express.Router();


router.get('/get',getFiltereredProducts);
router.get('/get/:id',getProductDetails);


module.exports=router;



