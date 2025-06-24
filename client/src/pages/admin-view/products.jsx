import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { fetchAllProducts, addNewProduct, editProduct, deleteProduct } from "@/store/admin/products-slice";
import { useSelector, useDispatch } from "react-redux";
import { data } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminProductTile from "@/components/admin-view/product-tile";
import { CardFooter } from "@/components/ui/card";


const initialFormData={
    image:null,
    title:'',
    description:'',
    category:'',
    brand:'',
    price:'',
    salePrice:'',
    totalStock:''
}

function AdminProducts() {
    const [openCreateProductsDialog,setOpenCreateProductsDialog]=useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const [imageFile,setImageFile]=useState(null);

    const [uploadedImageUrl,setUploadedImageUrl]=useState('')
    const [imageLoadingState,setImageLoadingState]=useState(false)
    const {productList}=useSelector(state=>state.adminProducts)
    const dispatch=useDispatch();
    const {toast}=useToast();

    function onSubmit(event) {
        event.preventDefault();
        if (currentEditedId !== null) {
            dispatch(editProduct({
                id: currentEditedId,
                formData
            })).then((data) => {
                if (data?.payload?.success) {
                    setCurrentEditedId(null);
                    setOpenCreateProductsDialog(false);
                    setFormData(initialFormData);
                    dispatch(fetchAllProducts());
                    toast({ title: "Product updated successfully" });
                } else {
                    toast({ title: "Failed to update product", variant: "destructive" });
                }
            });
        } else {
            dispatch(addNewProduct({
                ...formData,
                image: uploadedImageUrl
            })).then((data) => {
                if (data?.payload?.success) {
                    setOpenCreateProductsDialog(false);
                    setFormData(initialFormData);
                    setImageFile(null);
                    dispatch(fetchAllProducts());
                    toast({ title: 'Product added successfully' });
                } else {
                    toast({ title: "Failed to add product", variant: "destructive" });
                }
            });
        }
    }
    function handleDelete(getCurrentProductId){
        dispatch(deleteProduct(getCurrentProductId)).then(data=>{
            if(data?.payload?.success){
                toast({ title: 'Product deleted successfully' });
            } else {
                toast({ title: "Failed to delete product", variant: "destructive" });
            }
        })

    }

    function isFormValid(){
        const titleValid = formData && formData.title && formData.title.trim() !== '';
        const priceValid = formData && formData.price && 
            (typeof formData.price === 'string' ? formData.price.trim() !== '' : formData.price !== 0);
        return titleValid && priceValid;
    }

    useEffect(()=>{
        dispatch(fetchAllProducts())
    },[dispatch]);

    console.log(formData,"productList");


    return ( <Fragment>
        <div className="mb-5 w-full flex justify-end">
            <Button onClick={()=>setOpenCreateProductsDialog(true)} >
                Add new Product
            </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4" >
            {
                productList && productList.length>0 
                ?
                productList.map((productItem) => (
                  <AdminProductTile
                   setFormData={setFormData}
                   setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                   setCurrentEditedId={setCurrentEditedId}
                   key={productItem._id}
                   product={productItem}
                   handleDelete={handleDelete}
                 >
                    <CardFooter className="flex justify-between items-center">
                        <Button onClick={() => {
                            console.log('Edit button clicked for product:', productItem);
                            setOpenCreateProductsDialog(true);
                            setCurrentEditedId(productItem._id);
                            setFormData(productItem);
                            console.log('Set currentEditedId to:', productItem._id);
                            console.log('Set formData to:', productItem);
                        }}>Edit</Button>
                        <Button onClick={() => handleDelete(productItem._id)}>Delete</Button>
                    </CardFooter>
                 </AdminProductTile>
                )) 
                :  null}

        </div>

        <Sheet open={openCreateProductsDialog} 
            onOpenChange={(open) => {
                console.log('Sheet onOpenChange called with open:', open);
                if (!open) {
                    console.log('Closing sheet, resetting form');
                    setOpenCreateProductsDialog(false);
                    setCurrentEditedId(null);
                    setFormData(initialFormData);
                }
            }}
        >
            <SheetContent side="right" className="overflow-auto">
                <SheetHeader>
                    <SheetTitle>
                        {currentEditedId!=null ? 'Edit Product' : 'Add Product'}
                    </SheetTitle>
                </SheetHeader>
                <ProductImageUpload 
                    imageFile={imageFile} 
                    setImageFile={setImageFile} 
                    uploadedImageUrl={uploadedImageUrl} 
                    setUploadedImageUrl={setUploadedImageUrl}
                    setImageLoadingState={setImageLoadingState}
                    imageLoadingState={imageLoadingState}
                    isEditMode={currentEditedId !=null} />


                <div className="py-6" >
                    <CommonForm
                    onSubmit={onSubmit}
                    formData={formData} 
                    setFormData={setFormData} 
                    buttonText={currentEditedId!=null ? "Update":"Add"}
                    formControls={addProductFormElements}
                    isBtnDisabled={!isFormValid()}
                    />
                </div>

            </SheetContent>

        </Sheet>

    </Fragment>
    );
}
export default AdminProducts;