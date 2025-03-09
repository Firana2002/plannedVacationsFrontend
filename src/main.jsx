import React from "react";
import { createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CreateVacationPage from "./pages/CreateVacationPage";
import PlannedVacationsPage from "./pages/PlannedVacationsPage";
import ProfilePage from "./pages/ProfilePage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import './main.css';
import store from "@/redux/store.js";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("root element not found");

// Компонент для защиты маршрутов
const ProtectedRoute = ({ element, isPublic = false }) => {
  const user = useSelector((state) => state.user);
  console.log(user);

  if (isPublic) {
    return user.token ? <Navigate to={`/home/${user.id}`} replace /> : element;
  }

  return user.token ? element : <Navigate to="/login" replace />;
};

// Основной компонент с маршрутами
const App = () => (
  <>
    <Sidebar />
    <div className="app-container p-6">
      <Header />
      <div className="bg-white rounded-lg shadow-md p-8 mt-5">
        <Routes>
          <Route path="/create-vacation" element={<ProtectedRoute element={<CreateVacationPage />} />} />
          <Route path="/planned-vacation" element={<ProtectedRoute element={<PlannedVacationsPage />} />} />
          <Route path="/home/:id" element={<ProtectedRoute element={<ProfilePage />} />} />
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
        {/* Публичный маршрут (только для неавторизованных) */}
        <Route path="/login" element={<ProtectedRoute element={<LoginPage />} isPublic />} />

        {/* Приватные маршруты (только для авторизованных) */}
        <Route path="/*" element={<ProtectedRoute element={<App />} />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  </Provider>
);
