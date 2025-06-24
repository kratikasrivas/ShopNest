import ProductFilter from "../../components/shopping-view/filter";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { sortOptions } from "../../config";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "../../store/shop/products-slice";
import ShoppingProductTile from "../../components/shopping-view/product-tile";
import { categoryOptionsMap, brandOptionsMap } from "@/config";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { fetchProductDetails } from "../../store/shop/products-slice";
import ProductDetailsDialog from "../../components/shopping-view/product-details";

function createSearchParamsHelper(filtersParams) {
    const queryParam=[];
    for(const [key, value] of Object.entries(filtersParams)){
        if(Array.isArray(value) && value.length > 0){
            const paramValue=value.join(',');

            queryParam.push(`${key}=${encodeURIComponent(paramValue)}`);
        } 
    }
    console.log(queryParam, 'queryParam');
    return queryParam .join('&');
}

function ShoppingListing({product}){

    console.log(product);

    //fetch list of products
    const dispatch=useDispatch();
    const [open, setOpen] = useState(false);
    const {productList, productDetails}=useSelector(state => state.shopProducts);
    const [filters, setFilters] = useState({});
    const[sort,setSort]=useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [openDetailsDialog, setOpenDetailsDialog]=useState(false);

    function handleSort(value) {
        console.log(value);
        setSort(value);
    }

    function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
        // If the section doesn't exist, create it with the current option
    if (!cpyFilters[getSectionId]) {
        cpyFilters[getSectionId] = [getCurrentOption];
    } else {
        // If the option is not in the array, add it
        const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
        if (indexOfCurrentOption === -1) {
            cpyFilters[getSectionId].push(getCurrentOption);
        } else {
            // If the option is already in the array, remove it
            cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
            // If the array is empty after removal, delete the key
            if (cpyFilters[getSectionId].length === 0) {
                delete cpyFilters[getSectionId];
            }
        }
    }
    setFilters(cpyFilters);
    sessionStorage.setItem('filters', JSON.stringify(cpyFilters));
}

function handleGetProductDetails(getCurrentProductId){
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
}
    useEffect(() => {
        setSort('price-lowtohigh');
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
    }, []);

    useEffect(() => {
        if(filters && Object.keys(filters).length > 0){
            const createqueryString = createSearchParamsHelper(filters)
            setSearchParams(new URLSearchParams(createqueryString));
        }
    }, [filters]);

    useEffect(() => {
        if(filters!==null && sort!==null)
        dispatch(fetchAllFilteredProducts({filterParams:filters, sortParams:sort}));
    }, [dispatch, sort,filters]);

    useEffect(() => {
        if(productDetails!=null) setOpenDetailsDialog(true);
    },[productDetails])

    console.log(productDetails, "productDetails");


    return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
        <ProductFilter filters={filters} handleFilters={handleFilter} />
        <div className="bg-background w-full rounded-lg shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-extrabold ">Products</h2>
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{productList?.length}Products</span>
                    <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <ArrowsUpDownIcon className="h-4 w-4" />
                                    <span>Sort By</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                    {
                                        sortOptions.map(sortItem => (
                                            <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                                                {sortItem.label}
                                            </DropdownMenuRadioItem>
                                        ))
                                    }
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {
                    productList && productList.length > 0 ? (
                        productList.map((productItem, idx) => (
                            <ShoppingProductTile handleGetProductDetails={handleGetProductDetails} key={productItem.id || productItem._id || idx} product={productItem} />
                        ))
                    ) : null
                }


            </div>
        </div>
        <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
    );
}
export default ShoppingListing;


