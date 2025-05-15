import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import {
  LoginPage,
  CreateVacationPage,
  PlannedVacationsPage,
  ProfilePage,
  EmployeesPage,
  RequestsPage,
  EmployeeVacationDaysPage,
  AllVacationsPage,
  MainPage,
  SettingsPage
} from '@/pages';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import './main.css';
import store from "@/redux/store";
import { fetchUserDataStart, fetchUserDataSuccess, fetchUserDataFailure } from '@/redux/userSlice';
import { getEmployee } from '@/api/employees';

// Инициализация темы ДО монтирования приложения
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
};
initializeTheme();

const AppLayout = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AuthWrapper = () => {
  const dispatch = useDispatch();
  const token = Cookies.get('token');

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      fetchUserData(decodedToken.EmployeeId);
    }
  }, [dispatch, token]);

  const fetchUserData = async (userId) => {
    dispatch(fetchUserDataStart());
    try {
      const response = await getEmployee(userId);
      if (response.status !== 200) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.data;
      dispatch(fetchUserDataSuccess(userData));
    } catch (error) {
      dispatch(fetchUserDataFailure(error.message));
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("root element not found");

const root = createRoot(rootElement);
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthWrapper />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/main-page" replace />} />
            <Route path="/main-page" element={<MainPage />} />
            <Route path="/create-vacation" element={<CreateVacationPage />} />
            <Route path="/planned-vacation" element={<PlannedVacationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/vacation-days" element={<EmployeeVacationDaysPage />} />
            <Route path="/all-vacations" element={<AllVacationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  </Provider>
);