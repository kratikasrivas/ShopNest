import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { useSelector } from 'react-redux';


function ProductImageUpload({imageFile,setImageFile,imageLoadingState, setUploadedImageUrl,setImageLoadingState, isEditMode}) {

    const inputRef=useRef(null);

    function handleImageFileChange(event){
        console.log(event.target.files);
        const selectedFile=event.target.files?.[0];
        console.log(selectedFile);
        
        if(selectedFile) setImageFile(selectedFile);

    }

    function handleDragOver(event){
        event.preventDefault();
    }

    function handleDrop(event){
        event.preventDefault();
        const droppedFile=event.dataTransfer.files?.[0];
        if(droppedFile) setImageFile(droppedFile);
    }




    function handleRemoveImage(){
        setImageFile(null)
        if(inputRef.current){
            inputRef.current.value='';
        }
    }

    console.log(imageFile);


    async function uploadImageToCloudinary() {
    try {
        setImageLoadingState(true);
        const data = new FormData();
        data.append('my_file', imageFile);

        const response = await axios.post('http://localhost:5000/api/admin/products/upload-image', data);
        console.log(response, 'response');

        console.log(response.data, "Upload response");


        if (response?.data?.success) {
            setUploadedImageUrl(response.data.result.url);
        } else {
            console.error("Upload failed");
        }
    } catch (error) {
        console.error("Image upload error:", error);
    } finally {
        setImageLoadingState(false); // <- very important!
    }
    }


    useEffect(()=>{
        if(imageFile!==null) uploadImageToCloudinary();
    },[imageFile]);

    return ( 
        <div className="w-full max-w-md mx-auto mt-4" >
            <Label className="text-lg font-semibold mb-2 block" >Upload Image</Label>
            <div
  onDragOver={handleDragOver}
  onDrop={handleDrop}
  className={`
    ${isEditMode ? "opacity-60" : "bg-white text-black hover:bg-gray-100"}
    border-2 border-dashed rounded-lg p-4
  `}
>
                <Input id="image-upload" 
                    type="file" 
                    className="hidden"  
                    ref={inputRef} 
                    onChange={handleImageFileChange} 
                    disabled={isEditMode}/>
                {
                    !imageFile ? (

                    <Label htmlFor="image-upload" 
                    className={`${isEditMode ? 'cursor-not-allowed' : ''} flex flex-col items-center justify-center h-32 cursor-pointer`}>
                        <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                        <span>Drag & drop or click to upload image</span>

                    </Label>
                    ) : (
                        imageLoadingState ?(
                            <Skeleton className='h-10 bg-gray-200'/>
                        )
                         :
                        <div className="flex items-center justify-between" >
                            <div className="flex items-center" >
                                <FileIcon  className="w-8 h-8 text-primary mr-2" />
                            </div>
                            <p className="text-sm font-medium" >{imageFile.name}</p>
                            <Button variant="ghost" size="icon"  className="text-muted-foreground hover:text-foreground" onClick={handleRemoveImage} >
                                <XIcon className="w-4 h-4"/>
                                <span className="sr-only" >Remove File</span>
                            </Button>
                        </div>)
                }
            </div>
        </div>
     );
}

export default ProductImageUpload;


