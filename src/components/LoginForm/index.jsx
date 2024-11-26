import React, { useState } from 'react';
import InputField from '../InputField';
import Button from '../Button';
import PasswordInputField from '../PasswordInputField';
import './style.css';
import { useDispatch } from 'react-redux';
import { loginEmployee } from '@/api/employees';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch(); // Получаем dispatch

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const employee = await loginEmployee(username, password);
      if (employee) {
        dispatch({ type: 'SET_USER', payload: employee }); // Сохраняем пользователя в Redux
        // Здесь можно добавить редирект на другую страницу, например, на главную
        // history.push('/home'); // Если вы используете useHistory
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Неверные учетные данные');
    }
  };

  return (
    <div className="login-form-container">
      <p className="login-heading">ВХОД В СИСТЕМУ</p>
      <form onSubmit={handleLogin}>
        <InputField
          placeholder="ЛОГИН"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Обновляем состояние логина
        />
        <PasswordInputField
          placeholder="ПАРОЛЬ"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Обновляем состояние пароля
        />
        <Button text="ВОЙТИ" type="submit" /> {/* Указываем тип кнопки как submit */}
      </form>
      <a href="#" className="login-prompt">Не удаётся войти?</a>
    </div>
  );
}

export default LoginForm;
