import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


// 📩 CREATE CONTACT (PUBLIC)
export const createContact = createAsyncThunk(
  "contact/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/contact", formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to send message"
      );
    }
  }
);


const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },

  reducers: {
    clearContactState: (state) => {
      state.success = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 📩 SEND CONTACT
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })

      .addCase(createContact.fulfilled, (state) => {
        state.loading = false;
        state.success = "Message sent successfully";
      })

      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContactState } = contactSlice.actions;
export default contactSlice.reducer;