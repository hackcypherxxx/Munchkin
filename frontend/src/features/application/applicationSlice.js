import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


// ➕ CREATE APPLICATION (PUBLIC)
export const createApplication = createAsyncThunk(
  "application/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/applications", formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to submit application"
      );
    }
  }
);


// 📦 GET ALL APPLICATIONS (ADMIN)
export const getApplications = createAsyncThunk(
  "application/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/applications");
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch applications");
    }
  }
);


// 📄 GET ONE APPLICATION
export const getApplicationById = createAsyncThunk(
  "application/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/applications/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch application");
    }
  }
);


// ✅ APPROVE APPLICATION
export const approveApplication = createAsyncThunk(
  "application/approve",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/${id}/approve`);
      return { id, data: res.data };
    } catch (error) {
      return rejectWithValue("Failed to approve");
    }
  }
);


// ❌ REJECT APPLICATION
export const rejectApplication = createAsyncThunk(
  "application/reject",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/${id}/reject`);
      return { id, data: res.data };
    } catch (error) {
      return rejectWithValue("Failed to reject");
    }
  }
);


// 🗑️ DELETE APPLICATION
export const deleteApplication = createAsyncThunk(
  "application/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/applications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete");
    }
  }
);


const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applications: [],
    application: null,
    loading: false,
    error: null,
    success: null,
  },

  reducers: {
    clearApplicationState: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ➕ CREATE
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(createApplication.fulfilled, (state) => {
        state.loading = false;
        state.success = "Application submitted successfully";
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // 📦 GET ALL
      .addCase(getApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(getApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // 📄 GET ONE
      .addCase(getApplicationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.application = action.payload;
      })
      .addCase(getApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ✅ APPROVE
      .addCase(approveApplication.fulfilled, (state, action) => {
        const index = state.applications.findIndex(
          (a) => a._id === action.payload.id
        );

        if (index !== -1) {
          state.applications[index].status = "Approved";
        }
      })


      // ❌ REJECT
      .addCase(rejectApplication.fulfilled, (state, action) => {
        const index = state.applications.findIndex(
          (a) => a._id === action.payload.id
        );

        if (index !== -1) {
          state.applications[index].status = "Rejected";
        }
      })


      // 🗑️ DELETE
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (a) => a._id !== action.payload
        );
      });
  },
});

export const { clearApplicationState } = applicationSlice.actions;
export default applicationSlice.reducer;