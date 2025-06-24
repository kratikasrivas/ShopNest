const Product = require('../../models/Product');

const getFiltereredProducts = async(req, res) => {
    try{
        

        let { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

// Make sure category and brand are arrays
if (typeof category === "string") category = category.split(",");
if (typeof brand === "string") brand = brand.split(",");

let filter = {};
if (category.length > 0 && category[0] !== "") {
    filter.category = { $in: category };
}
if (brand.length > 0 && brand[0] !== "") {
    filter.brand = { $in: brand };
}

        let sort = {};
        let sortDirection = 1; // 1 for ascending, -1 for descending
        
        switch(sortBy) {
            case 'price-lowtohigh':
                sortDirection = 1;
                break;
            case 'price-hightolow':
                sortDirection = -1;
                break;
            case 'title-atoz':
                sort.title = 1;
                break;
            case 'title-ztoa':
                sort.title = -1;
                break;
            default:
                sortDirection = 1;
                break;
        }

        // Use aggregation pipeline to handle both sale price and regular price
        const products = await Product.aggregate([
            { $match: filter },
            { $addFields: {
                effectivePrice: {
                    $cond: {
                        if: { $gt: ["$salePrice", 0] },
                        then: "$salePrice",
                        else: "$price"
                    }
                }
            }},
            { $sort: {
                effectivePrice: sortDirection
            }}
        ]);

        res.status(200).json({
            success:true,
            data: products
        })

    }catch(e){
    console.log(e);
        res.status(500).json({
            success:false,
            message: 'Some error occured'
        })

    }
}

async function fetchAllProducts(req, res) {
  try {
    const getAllProducts = await Product.find({});
    if (getAllProducts) {
      return res.status(200).json({
        success: true,
        data: getAllProducts,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
    
  }
}

const getProductDetails= async(req,res)=>{
  try{
    const {id} = req.params;
    const product = await Product.findById(id);

    if(!product) return res.status(404).json({
      success:false,
      message: 'Product not found!'
    })

    res.status(200).json({
      success : true,
      data : product
    })


  }catch(e){
    console.log(error);
    res.status(500).json({
      success:false,
      message:"Some error occured",
    })

  }
}

module.exports = {
    getFiltereredProducts,
    fetchAllProducts, getProductDetails
};