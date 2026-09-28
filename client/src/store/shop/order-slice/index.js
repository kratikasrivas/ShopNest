import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "@/lib/api";


const initialState = {
    approvalURL: null,
    isLoading: false,
    orderId: null,
    orders: [],
};
export const createNewOrder=createAsyncThunk('/order/createNewOrder',async(orderData)=>{
      const response=await axios.post(`${API_URL}/api/shop/order/create`,orderData);
      return response.data;
})
export const capturePayment=createAsyncThunk('/order/capturePayment',async({paymentId,payerId,orderId})=>{
      const response=await axios.post(`${API_URL}/api/shop/order/capture`,{paymentId,payerId,orderId});
      return response.data;
})
export const fetchAllOrdersByUserId = createAsyncThunk(
  "/order/fetchAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(
      `${API_URL}/api/shop/order/list/${userId}`
    );
    return response.data;
  }
);
const shoppingOrderSlice=createSlice({
    name:'shoppingOrderSlice',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(createNewOrder.pending,(state)=>{
            state.isLoading=true
        })
         .addCase(createNewOrder.fulfilled,(state,action)=>{
            state.isLoading=false
            state.approvalURL=action.payload.approvalURL;
            state.orderId=action.payload.orderId;
            sessionStorage.setItem('currentOrderId',
                JSON.stringify(action.payload.orderId)
            );
        })
         .addCase(createNewOrder.rejected,(state)=>{
            state.isLoading=false;
            state.approvalURL=null
            state.orderId=null
        })
        .addCase(fetchAllOrdersByUserId.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchAllOrdersByUserId.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orders = action.payload.data;
        })
        .addCase(fetchAllOrdersByUserId.rejected, (state) => {
            state.isLoading = false;
            state.orders = [];
        })

    }
});
export default shoppingOrderSlice.reducer;