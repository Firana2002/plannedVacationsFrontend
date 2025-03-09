import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ErrorMessage from '@/components/ErrorMessage';
import { loginUser } from '@/api/Auth';
import { setUser } from '@/redux/authSlice';
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

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

            navigate('/home');
        } catch (err) {
            console.error(err)
            setError('Ошибка входа. Проверьте свои учетные данные.');
        }
    };

    const token = Cookies.get('token');
    if(token) {
        return <Navigate to={`/home`} />
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl mb-4">Вход</h2>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Войти
                </button>
            </form>
        </div>
    );
};

export default Login;
