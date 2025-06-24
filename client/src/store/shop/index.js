import axios from 'axios';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const intitialState = {
    productList: [],
    isLoading: false,

};

export const fetchAllFilteredProducts =createAsyncThunk('/products/fetchAllProducts',
    async ()=>{
        const result=await axios.get('http://localhost:5000/api/shop/products/get');

        return result?.data;
        
    }
);

const shopProductSlice = createSlice({
    name: 'shoppingProducts',
    initialState,
    reducers: {},
    extraReducers:(builder) => {
        builder
            .addCase(fetchAllFilteredProducts.pending, (state,action) => {
                state.isLoading = true;
            })
            .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
                console.log(action.payload,'action.payload');
                state.isLoading = false;
                state.productList = action.payload,data;
            })
            .addCase(fetchAllFilteredProducts.rejected, (state,action) => {
                state.isLoading = false;
                state.productList = [];
            });
    }

})

export default shoppingProductSlice.reducer;