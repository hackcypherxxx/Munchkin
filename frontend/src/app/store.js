import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import applicationReducer from "../features/application/applicationSlice";
import adminContactReducer from "../features/adminContact/adminContactSlice";
import contactReducer from "../features/contact/contactSlice";
import kittenReducer from "../features/kitten/kittenSlice";
import notificationReducer from "../features/notification/notificationSlice";
import retiredReducer from "../features/retired/retiredSlice";
import reviewReducer from "../features/review/reviewSlice";
import settingsReducer from "../features/settings/settingsSlice";
import upcomingReducer from "../features/upcoming/upcomingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
     application: applicationReducer,
     adminContact: adminContactReducer,
     contact: contactReducer,
     kitten: kittenReducer,
     notification: notificationReducer,
     retired: retiredReducer,
     review: reviewReducer,
     settings: settingsReducer,
     upcoming: upcomingReducer,
  },
});