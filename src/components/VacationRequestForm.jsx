import React, { useState, useEffect } from 'react';
import { getEmployees, getVacationTypes, createVacationRequest } from '@/api/plannedVacations';

const VacationRequestForm = () => {
    const [employeeId, setEmployeeId] = useState(0);
    const [vacationTypeId, setVacationTypeId] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('Pending');
    const [comment, setComment] = useState('');
    const [plannedVacationId, setPlannedVacationId] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [vacationTypes, setVacationTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const vacationTypesData = await getVacationTypes();
            setVacationTypes(vacationTypesData);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const vacationRequest = {
            employeeId,
            vacationTypeId,
            startDate,
            endDate,
            status,
            comment,
            plannedVacationId,
        };
        await createVacationRequest(vacationRequest);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Заявка на отпуск</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Сотрудник</label>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Тип отпуска</label>
                <select
                    value={vacationTypeId}
                    onChange={(e) => setVacationTypeId(Number(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                >
                    <option value={0}>Выберите тип отпуска</option>
                    {vacationTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Дата начала</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Дата окончания</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Комментарий</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600"
            >
                Отправить заявку
            </button>
        </form>
    );
};

export default VacationRequestForm;

