import React, { useState } from 'react';
import ErrorMessage from '@/components/ErrorMessage';
import { loginUser } from '@/api/Auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [role, setRole] = useState('сотрудник');
    const [employeeId, setEmployeeId] = useState(0);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginUser(email, password, role, employeeId);
            console.log('Login successful:', response.data);
            // Здесь можно добавить редирект или другую логику
        } catch (err) {
            setError('Ошибка входа. Проверьте свои учетные данные.');
        }
    };

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
