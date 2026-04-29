import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


// ➕ CREATE REVIEW (with image)
export const createReview = createAsyncThunk(
  "review/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/reviews", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to submit review"
      );
    }
  }
);


// 🌍 GET APPROVED REVIEWS
export const getReviews = createAsyncThunk(
  "review/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/reviews");
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch reviews");
    }
  }
);


// ⭐ GET STATS
export const getReviewStats = createAsyncThunk(
  "review/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/reviews/stats");
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch review stats");
    }
  }
);


// 👑 ADMIN: GET ALL
export const getAllReviewsAdmin = createAsyncThunk(
  "review/getAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/reviews/admin");
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch admin reviews");
    }
  }
);


// ✅ APPROVE
export const approveReview = createAsyncThunk(
  "review/approve",
  async (id, { rejectWithValue }) => {
    try {
      await api.put(`/reviews/${id}/approve`);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to approve review");
    }
  }
);


// ❌ DELETE
export const deleteReview = createAsyncThunk(
  "review/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete review");
    }
  }
);


const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],         // public (approved only)
    adminReviews: [],    // all reviews
    stats: {
      avgRating: 0,
      totalReviews: 0,
    },
    loading: false,
    error: null,
    success: null,
  },

  reducers: {
    clearReviewState: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ➕ CREATE
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.loading = false;
        state.success = "Review submitted for approval";
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // 🌍 GET REVIEWS
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ⭐ STATS
      .addCase(getReviewStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })


      // 👑 ADMIN GET
      .addCase(getAllReviewsAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllReviewsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminReviews = action.payload;
      })
      .addCase(getAllReviewsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ✅ APPROVE
      .addCase(approveReview.fulfilled, (state, action) => {
        const review = state.adminReviews.find(
          (r) => r._id === action.payload
        );

        if (review) {
          review.isApproved = true;
        }

        state.success = "Review approved";
      })


      // ❌ DELETE
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.adminReviews = state.adminReviews.filter(
          (r) => r._id !== action.payload
        );

        state.success = "Review deleted";
      });
  },
});

export const { clearReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;