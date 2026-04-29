import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


// 🌍 GET ALL UPCOMING
export const getUpcoming = createAsyncThunk(
  "upcoming/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/upcoming");
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch upcoming litters");
    }
  }
);


// 📄 GET SINGLE
export const getUpcomingById = createAsyncThunk(
  "upcoming/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/upcoming/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch upcoming litter");
    }
  }
);


// ➕ CREATE (ADMIN)
export const createUpcoming = createAsyncThunk(
  "upcoming/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/upcoming", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create upcoming litter"
      );
    }
  }
);


// ✏️ UPDATE
export const updateUpcoming = createAsyncThunk(
  "upcoming/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/upcoming/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to update upcoming litter");
    }
  }
);


// 🗑️ DELETE
export const deleteUpcoming = createAsyncThunk(
  "upcoming/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/upcoming/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete upcoming litter");
    }
  }
);


const upcomingSlice = createSlice({
  name: "upcoming",
  initialState: {
    upcomingList: [],
    upcoming: null,
    loading: false,
    error: null,
    success: null,
  },

  reducers: {
    clearUpcomingState: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🌍 GET ALL
      .addCase(getUpcoming.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUpcoming.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingList = action.payload;
      })
      .addCase(getUpcoming.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // 📄 GET ONE
      .addCase(getUpcomingById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUpcomingById.fulfilled, (state, action) => {
        state.loading = false;
        state.upcoming = action.payload;
      })
      .addCase(getUpcomingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ➕ CREATE
      .addCase(createUpcoming.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUpcoming.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Upcoming litter created";
        state.upcomingList.unshift(action.payload);
      })
      .addCase(createUpcoming.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ✏️ UPDATE
      .addCase(updateUpcoming.fulfilled, (state, action) => {
        const index = state.upcomingList.findIndex(
          (u) => u._id === action.payload._id
        );

        if (index !== -1) {
          state.upcomingList[index] = action.payload;
        }

        state.success = "Upcoming litter updated";
      })


      // 🗑️ DELETE
      .addCase(deleteUpcoming.fulfilled, (state, action) => {
        state.upcomingList = state.upcomingList.filter(
          (u) => u._id !== action.payload
        );

        state.success = "Upcoming litter deleted";
      });
  },
});

export const { clearUpcomingState } = upcomingSlice.actions;
export default upcomingSlice.reducer;