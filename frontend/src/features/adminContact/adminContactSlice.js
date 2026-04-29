import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


// 📧 SEND ADMIN MESSAGE
export const sendAdminMessage = createAsyncThunk(
  "adminContact/send",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin-contact/send", formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to send message"
      );
    }
  }
);


const adminContactSlice = createSlice({
  name: "adminContact",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },

  reducers: {
    clearAdminContactState: (state) => {
      state.success = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 📧 SEND MESSAGE
      .addCase(sendAdminMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })

      .addCase(sendAdminMessage.fulfilled, (state) => {
        state.loading = false;
        state.success = "Message sent successfully";
      })

      .addCase(sendAdminMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminContactState } = adminContactSlice.actions;
export default adminContactSlice.reducer;