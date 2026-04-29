import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider, useDispatch } from "react-redux";

import './index.css'
import App from './App.jsx'
import { store } from "./app/store";
import { fetchMe } from "./features/auth/authSlice";


// 🔐 AUTH INITIALIZER
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return children;
};


// 🚀 ROOT RENDER
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <Provider store={store}>
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </Provider>
    </StrictMode>
  </BrowserRouter>
);