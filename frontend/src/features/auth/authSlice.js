import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// 🔐 LOGIN
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Login failed"
      );
    }
  }
);

// 🔁 CHECK TOKEN (on refresh)
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/me");
      return res.data;
    } catch (error) {
      return rejectWithValue("Session expired");
    }
  }
);

const initialState = {
  admin: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.error = null;

      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder

      // 🔐 LOGIN
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;

        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔁 FETCH ME
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.token = null;

        localStorage.removeItem("token");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;