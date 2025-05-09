import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ErrorMessage from '@/components/ErrorMessage';
import { loginUser } from '@/api/Auth';
import { setUser } from '@/redux/authSlice';
import Cookies from 'js-cookie';
import axios from 'axios';
import './LoginWindow.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginUser(email, password);
            dispatch(setUser({ token: response }));
            
            // Перенаправляем на страницу сотрудников после успешного входа
            navigate('/vacation-days');
        } catch (err) {
            console.error(err);
            setError('Ошибка входа. Проверьте свои учетные данные.');
        }
    };

    return (
        <div className="login-window">
            <div className="login-form">
                <img src="/images/image6.png" alt="Логотип" className="login-image" />
                <h2 className="login-title">Вход в систему</h2>
                {error && <ErrorMessage message={error} />}
                <div className="input-container">
                    <input
                        type="email"
                        value={email}
                        placeholder="Логин"
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button className="login-button" onClick={handleLogin}>Войти</button>
                </div>
                <a href="#" className="forgot-password">Не удаётся войти?</a>
            </div>
        </div>
    );
};

axios.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default Login;