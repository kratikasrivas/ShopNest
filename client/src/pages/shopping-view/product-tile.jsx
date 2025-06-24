import { categoryOptionsMap, brandOptionsMap } from "@/config";
const { Card } = require("@/components/ui/card");

function ShoppingProductTile({ product }) {
    return (
        <Card className="w-full max-w-sm mx-auto">
            <div>
                <div className="relative">
                    <img 
                    src={product?.image} 
                    alt={product?.title } 
                    className="w-dull h-[300px] object-cover rounded-t-lg"
                    />
                    {
                        product?.salePrice > 0 ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            Sale
                        </Badge>
                    ) : null}

                </div>
                <CardContent className="p-4">
                    <h2 className="text-lg font-bold mb-2">{product?.name}</h2>
                    <div>
                        <span className="text-sm text-muted-foreground">{categoryOptionsMap[product?.category]}</span>
                        <span className="text-sm text-muted-foreground">{brandOptionsMap[product?.brand]}</span>
                    </div>
                    <div>
                        <span className={`${product?.salePrice > 0 ? "line-through" : ""} text-lg text-primary font-semibold`}>${product?.price}</span>
                        {
                            product?.salePrice > 0 ?
                            <span className="text-lg text-primary font-semibold">${product?.salePrice }</span> : null
                        }
                        
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Add to Cart</Button>
                </CardFooter>
            </div>
        </Card>
    )

}