import React, { useState } from 'react';
import axios from 'axios';
import ErrorMessage from '@/components/ErrorMessage';
import { registerUser } from '@/api/Auth';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('сотрудник');
    const [employeeId, setEmployeeId] = useState(0);
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await registerUser(email, password, role, employeeId);
            console.log('Registration successful:', response.data);
        } catch (err) {
            setError('Ошибка регистрации. Проверьте введенные данные.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl mb-4">Регистрация</h2>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md">
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
                <div className="mb-4">
                    <label className="block text-gray-700">Роль</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                    >
                        <option value="сотрудник">Сотрудник</option>
                        <option value="руководитель">Руководитель</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">ID сотрудника</label>
                    <input
                        type="number"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(Number(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Зарегистрироваться
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
