import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


// 🌍 GET PUBLIC NOTIFICATIONS
export const getNotifications = createAsyncThunk(
  "notification/getPublic",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/notifications");
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch notifications");
    }
  }
);


// 👑 GET ALL (ADMIN)
export const getAllNotificationsAdmin = createAsyncThunk(
  "notification/getAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/notifications/admin");
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch admin notifications");
    }
  }
);


// ➕ CREATE
export const createNotification = createAsyncThunk(
  "notification/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/notifications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create notification"
      );
    }
  }
);


// ✏️ UPDATE
export const updateNotification = createAsyncThunk(
  "notification/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/notifications/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue("Failed to update notification");
    }
  }
);


// 🗑️ DELETE
export const deleteNotification = createAsyncThunk(
  "notification/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete notification");
    }
  }
);


const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],        // public
    adminNotifications: [],   // admin
    loading: false,
    error: null,
    success: null,
  },

  reducers: {
    clearNotificationState: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🌍 PUBLIC
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // 👑 ADMIN FETCH
      .addCase(getAllNotificationsAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllNotificationsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminNotifications = action.payload;
      })
      .addCase(getAllNotificationsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ➕ CREATE
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Notification created";
        state.adminNotifications.unshift(action.payload);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ✏️ UPDATE
      .addCase(updateNotification.fulfilled, (state, action) => {
        const index = state.adminNotifications.findIndex(
          (n) => n._id === action.payload._id
        );

        if (index !== -1) {
          state.adminNotifications[index] = action.payload;
        }

        state.success = "Notification updated";
      })


      // 🗑️ DELETE
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.adminNotifications = state.adminNotifications.filter(
          (n) => n._id !== action.payload
        );

        state.success = "Notification deleted";
      });
  },
});

export const { clearNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;