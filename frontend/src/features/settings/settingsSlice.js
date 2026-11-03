import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


// 🌍 GET SETTINGS
export const getSettings = createAsyncThunk(
  "settings/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/settings");
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch settings");
    }
  }
);


// 🔐 UPDATE SETTINGS (ADMIN)
export const updateSettings = createAsyncThunk(
  "settings/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put("/settings", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update settings"
      );
    }
  }
);
export const updateLocation = updateSettings;


const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    settings: null,
    loading: false,
    error: null,
    success: null,
  },

  reducers: {
    clearSettingsState: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🌍 GET
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // 🔐 UPDATE
      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.success = "Location updated successfully";
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;