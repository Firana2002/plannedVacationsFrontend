import React, { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './main.css';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LoginPage from './pages/LoginPage';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import ProfilePage from "./pages/ProfilePage";
import EmployeeTable from "./components/TeamOverviewView";
import CalendarPage from "./pages/CalendarPage";
import store from './store';
import { useSelector } from 'react-redux';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("root element not found");

const MainPapper = styled(Paper)(() => ({
  padding: 58,
  borderRadius: 20,
  marginTop: 20,
}));

const PrivateRoute = ({ element }) => {
  const user = useSelector((state) => state.user);
  console.log(user)

  return user ? <Navigate to={`/home/${user.id}`} replace /> : element;
};

const AppRoutes = () => (
  <>
    <Sidebar />
    <div className="app-container">
      <Header />
      <MainPapper square={false}>
        <Routes>
          <Route path="/schedule" element={<CalendarPage />} />
          <Route path="/employees" element={<EmployeeTable />} />
          <Route path="/home/:id" element={<ProfilePage />} />
        </Routes>
      </MainPapper>
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
        
        {/* Основные маршруты с сайдбаром и шапкой */}
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Router>
  </Provider>
);
