import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "@/lib/api";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
  "shopReview/addReview",
  async (reviewData) => {
    const response = await axios.post(
      `${API_URL}/api/shop/review/add`,
      reviewData
    );

    return response.data;
  }
);

export const getReviews = createAsyncThunk(
  "shopReview/getReviews",
  async (productId) => {
    const response = await axios.get(
      `${API_URL}/api/shop/review/${productId}`
    );

    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "shopReview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;