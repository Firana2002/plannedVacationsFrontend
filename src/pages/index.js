// Импортируем все страницы
import LoginPage from './LoginPage';
import CreateVacationPage from './CreateVacationPage';
import PlannedVacationsPage from './PlannedVacationsPage';
import ProfilePage from './ProfilePage';
import EmployeesPage from './EmployeesPage';
import RequestsPage from './RequestsPage';
import AllVacationsPage from './AllVacationsPage'; // Автоматически найдёт index.jsx
import EmployeeVacationDaysPage from './EmployeeVacationDaysPage/EmployeeVacationDaysPage.jsx';
import MainPage from './MainPage/MainPage.jsx';
import SettingsPage from './SettingsPage/SettingsPage.jsx'

// Экспортируем все компоненты единообразно
export {
  LoginPage,
  CreateVacationPage,
  PlannedVacationsPage,
  ProfilePage,
  EmployeesPage,
  RequestsPage,
  AllVacationsPage,
  EmployeeVacationDaysPage,
  MainPage,
  SettingsPage
};