import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// 📚 GET ALL EMAIL TEMPLATES
export const fetchEmailTemplatesThunk = createAsyncThunk(
  "email/fetchTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/emails/templates");
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to load email templates");
    }
  }
);

// 📜 GET EMAIL ACTIVITY LOGS
export const fetchEmailLogsThunk = createAsyncThunk(
  "email/fetchLogs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/emails/logs");
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to load email history");
    }
  }
);

// 📧 SEND TRACKED TEMPLATE OR CUSTOM EMAIL
export const sendTrackedEmailThunk = createAsyncThunk(
  "email/sendTracked",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/emails/send", payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to send email"
      );
    }
  }
);

const emailSlice = createSlice({
  name: "email",
  initialState: {
    templates: [],
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailTemplatesThunk.fulfilled, (state, action) => {
        state.templates = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchEmailLogsThunk.fulfilled, (state, action) => {
        state.logs = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(sendTrackedEmailThunk.fulfilled, (state, action) => {
        if (action.payload?.emailLog) {
          state.logs.unshift(action.payload.emailLog);
        }
      });
  },
});

export default emailSlice.reducer;

