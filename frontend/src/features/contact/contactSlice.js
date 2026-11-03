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

// 📦 GET ALL ENQUIRIES (ADMIN)
export const getContacts = createAsyncThunk(
  "contact/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/contact");
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to load customer enquiries");
    }
  }
);

// ✏️ UPDATE ENQUIRY (ADMIN)
export const updateContact = createAsyncThunk(
  "contact/update",
  async ({ id, status, adminNotes }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/contact/${id}`, { status, adminNotes });
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to update enquiry");
    }
  }
);

// 🗑️ DELETE ENQUIRY (ADMIN)
export const deleteContact = createAsyncThunk(
  "contact/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contact/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete enquiry");
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contacts: [],
    lastEnquiryReference: null,
    loading: false,
    success: null,
    error: null,
  },

  reducers: {
    clearContactState: (state) => {
      state.success = null;
      state.error = null;
      state.lastEnquiryReference = null;
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
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Message sent successfully";
        state.lastEnquiryReference = action.payload?.enquiryReference || null;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📦 GET ALL
      .addCase(getContacts.fulfilled, (state, action) => {
        state.contacts = Array.isArray(action.payload) ? action.payload : [];
      })

      // ✏️ UPDATE
      .addCase(updateContact.fulfilled, (state, action) => {
        const idx = state.contacts.findIndex(
          (c) => c._id === action.payload._id
        );
        if (idx !== -1) {
          state.contacts[idx] = action.payload;
        }
      })

      // 🗑️ DELETE
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter((c) => c._id !== action.payload);
      });
  },
});

export const { clearContactState } = contactSlice.actions;
export default contactSlice.reducer;
