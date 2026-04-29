import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


// 🌍 GET ALL RETIRED
export const getRetired = createAsyncThunk(
  "retired/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/retired");

      // 🔥 SAFE NORMALIZATION
      const data =
        Array.isArray(res.data)
          ? res.data
          : res.data.retired || res.data.data || [];

      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch retired cats");
    }
  }
);


// 📄 GET ONE
export const getRetiredById = createAsyncThunk(
  "retired/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/retired/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch retired cat");
    }
  }
);


// ➕ CREATE
export const createRetired = createAsyncThunk(
  "retired/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/retired", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create retired cat"
      );
    }
  }
);


// ✏️ UPDATE
export const updateRetired = createAsyncThunk(
  "retired/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/retired/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to update retired cat");
    }
  }
);


// 🗑️ DELETE
export const deleteRetired = createAsyncThunk(
  "retired/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/retired/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete retired cat");
    }
  }
);


const retiredSlice = createSlice({
  name: "retired",
  initialState: {
    retiredList: [],
    retired: null,
    loading: false,
    error: null,
    success: null,
  },

  reducers: {
    clearRetiredState: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🌍 GET ALL
      .addCase(getRetired.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRetired.fulfilled, (state, action) => {
        state.loading = false;
        state.retiredList = action.payload || []; // 🔥 SAFE
      })
      .addCase(getRetired.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // 📄 GET ONE
      .addCase(getRetiredById.fulfilled, (state, action) => {
        state.retired = action.payload;
      })


      // ➕ CREATE
      .addCase(createRetired.fulfilled, (state, action) => {
        state.success = "Retired cat created";
        state.retiredList.unshift(action.payload);
      })


      // ✏️ UPDATE
      .addCase(updateRetired.fulfilled, (state, action) => {
        const index = state.retiredList.findIndex(
          (r) => r._id === action.payload._id
        );

        if (index !== -1) {
          state.retiredList[index] = action.payload;
        }

        state.success = "Retired cat updated";
      })


      // 🗑️ DELETE
      .addCase(deleteRetired.fulfilled, (state, action) => {
        state.retiredList = state.retiredList.filter(
          (r) => r._id !== action.payload
        );

        state.success = "Retired cat deleted";
      });
  },
});

export const { clearRetiredState } = retiredSlice.actions;
export default retiredSlice.reducer;