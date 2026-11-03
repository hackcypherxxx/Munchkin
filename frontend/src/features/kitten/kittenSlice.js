import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// 📦 GET ALL KITTENS (PUBLIC OR ADMIN ?includeAll=true)
export const getKittens = createAsyncThunk(
  "kitten/getAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query =
        params && params.includeAll ? "?includeAll=true&limit=100" : "?limit=50";
      const res = await api.get(`/kittens${query}`);
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch kittens");
    }
  }
);

// 📄 GET SINGLE KITTEN
export const getKittenById = createAsyncThunk(
  "kitten/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/kittens/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch kitten");
    }
  }
);

// ➕ CREATE KITTEN (ADMIN)
export const createKitten = createAsyncThunk(
  "kitten/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/kittens", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create kitten"
      );
    }
  }
);

// ✏️ UPDATE KITTEN
export const updateKitten = createAsyncThunk(
  "kitten/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/kittens/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update kitten"
      );
    }
  }
);

// 🗑️ DELETE KITTEN
export const deleteKitten = createAsyncThunk(
  "kitten/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/kittens/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete kitten");
    }
  }
);

const kittenSlice = createSlice({
  name: "kitten",
  initialState: {
    kittens: [],
    kitten: null,
    loading: false,
    error: null,
    success: null,
  },

  reducers: {
    clearKittenState: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // 📦 GET ALL
      .addCase(getKittens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKittens.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.kittens = action.payload;
        } else if (Array.isArray(action.payload?.kittens)) {
          state.kittens = action.payload.kittens;
        } else {
          state.kittens = [];
        }
      })
      .addCase(getKittens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 GET ONE
      .addCase(getKittenById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getKittenById.fulfilled, (state, action) => {
        state.loading = false;
        state.kitten = action.payload;
      })
      .addCase(getKittenById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ CREATE
      .addCase(createKitten.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createKitten.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Kitten created successfully";
        if (!Array.isArray(state.kittens)) {
          state.kittens = [];
        }
        state.kittens.unshift(action.payload);
      })
      .addCase(createKitten.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✏️ UPDATE
      .addCase(updateKitten.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateKitten.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.kittens)) return;
        const index = state.kittens.findIndex(
          (k) => k._id === action.payload._id
        );
        if (index !== -1) {
          state.kittens[index] = action.payload;
        }
        state.success = "Kitten updated successfully";
      })
      .addCase(updateKitten.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🗑️ DELETE
      .addCase(deleteKitten.fulfilled, (state, action) => {
        if (!Array.isArray(state.kittens)) return;
        state.kittens = state.kittens.filter((k) => k._id !== action.payload);
        state.success = "Kitten deleted";
      });
  },
});

export const { clearKittenState } = kittenSlice.actions;
export default kittenSlice.reducer;
