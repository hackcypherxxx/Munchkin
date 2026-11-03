import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// 📊 GET AI HEALTH & CONFIG
export const fetchAiHealthThunk = createAsyncThunk(
  "ai/fetchHealth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/ai/health");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to load AI configuration"
      );
    }
  }
);

// ⚙️ UPDATE AI CONFIG
export const updateAiConfigThunk = createAsyncThunk(
  "ai/updateConfig",
  async (updates, { rejectWithValue }) => {
    try {
      const res = await api.put("/ai/config", updates);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update AI configuration"
      );
    }
  }
);

// 🤖 GENERATE KITTEN LISTING DRAFT WITH AI
export const generateAiListingThunk = createAsyncThunk(
  "ai/generateListing",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/ai/generate-listing", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          error: "Failed to generate AI listing draft",
        }
      );
    }
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    health: null,
    draft: null,
    telemetry: null,
    uploadedImageUrls: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAiError: (state) => {
      state.error = null;
    },
    setAiDraftState: (state, action) => {
      state.draft = action.payload;
    },
    resetAiWizardState: (state) => {
      state.draft = null;
      state.telemetry = null;
      state.uploadedImageUrls = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiHealthThunk.fulfilled, (state, action) => {
        state.health = action.payload;
      })
      .addCase(updateAiConfigThunk.fulfilled, (state, action) => {
        state.health = action.payload;
      })
      .addCase(generateAiListingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateAiListingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.draft = action.payload.listing;
        state.telemetry = action.payload.telemetry;
        if (Array.isArray(action.payload.uploadedImageUrls)) {
          state.uploadedImageUrls = action.payload.uploadedImageUrls;
        }
      })
      .addCase(generateAiListingThunk.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.error = payload.error || "Failed to generate AI listing";
        if (payload.preservedDraft) {
          state.draft = payload.preservedDraft;
        }
        if (payload.telemetry) {
          state.telemetry = payload.telemetry;
        }
        if (Array.isArray(payload.uploadedImageUrls)) {
          state.uploadedImageUrls = payload.uploadedImageUrls;
        }
      });
  },
});

export const { clearAiError, setAiDraftState, resetAiWizardState } =
  aiSlice.actions;
export default aiSlice.reducer;

