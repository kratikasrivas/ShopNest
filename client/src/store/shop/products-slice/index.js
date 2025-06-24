import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
      const response = await axios.get(`http://localhost:5000/api/shop/products/get?${query}`);
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
      const result = await axios.get(`http://localhost:5000/api/shop/products/get/${id}`);
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        console.log(action.payload,'action.payload');
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        console.log(action.payload,'action.payload');
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export default shopProductsSlice.reducer;