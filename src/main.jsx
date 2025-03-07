import React, { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './main.css';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from "./pages/ProfilePage";
import EmployeeTable from "@/components/TeamOverviewView";
import CreateVacationPage from "@/pages/CreateVacationPage";
import PlannedVacationsPage from "@/pages/PlannedVacationsPage";
import store from './store';
import { useSelector } from 'react-redux';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("root element not found");

const PrivateRoute = ({ element }) => {
  const user = useSelector((state) => state.user);
  return user ? <Navigate to={`/home/${user.id}`} replace /> : element;
};

const AppRoutes = () => (
  <>
    <Sidebar />
    <div className="app-container p-6">
      <Header />
      <div className="bg-white rounded-lg shadow-md p-8 mt-5">
        <Routes>
          <Route path="/employees" element={<EmployeeTable />} />
          <Route path="/create-vacation" element={<CreateVacationPage />} />
          <Route path="/planned-vacation" element={<PlannedVacationsPage />} />
          <Route path="/home/:id" element={<ProfilePage />} />
        </Routes>
      </div>
    </div>
  </>
);

const root = createRoot(rootElement);
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        {/* Маршрут для страницы авторизации */}
        <Route path="/login" element={<PrivateRoute element={<LoginPage />} />} />
        <Route path="/register" element={<PrivateRoute element={<RegisterPage />} />} />
        
        {/* Основные маршруты с сайдбаром и шапкой */}
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Router>
  </Provider>
);
