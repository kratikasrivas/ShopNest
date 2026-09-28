import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "@/lib/api";

const initialState = {
  productList: [],
  isLoading: false,
  productDetails: null,
};


export const fetchAllFilteredProducts = createAsyncThunk(
  "shop/products",
  async ({filterParams, sortParams}) => {
    try {
      const query=new URLSearchParams({
        ...filterParams,
        sortBy: sortParams
      })
      const response = await axios.get(
        `${API_URL}/api/shop/products/get?${query}&_=${Date.now()}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);


export const fetchProductDetails= createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    try {
      const result = await axios.get(`${API_URL}/api/shop/products/get/${id}`);
      return result?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const shopProductsSlice = createSlice({
  name: "shopProducts",
  initialState,
  reducers: {
    setProductDetails:(state)=>{
      state.productDetails=null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state,action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        console.log(action.payload,'action.payload');
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state,action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state,action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        console.log(action.payload,'action.payload');
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state,action) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});
export const {setProductDetails}=shopProductsSlice.actions;

export default shopProductsSlice.reducer;