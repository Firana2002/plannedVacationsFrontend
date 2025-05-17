import React, { useState, useEffect } from 'react';
import { getVacationTypes, createVacationRequest, getMyPlannedVacations } from '@/api/plannedVacations';
import { getEmployee } from '@/api/employees';
import { useSelector } from 'react-redux';
import './AddVacationPage.css';

const VacationRequestForm = () => {
    const [employeeId, setEmployeeId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [vacationTypeId, setVacationTypeId] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [daysCount, setDaysCount] = useState(0);
    const [comment, setComment] = useState('');
    const [vacationTypes, setVacationTypes] = useState([]);
    const [employeeData, setEmployeeData] = useState(null);
    const { userData } = useSelector((state) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [warning, setWarning] = useState(null);
    const [approvedVacations, setApprovedVacations] = useState([]);

    useEffect(() => {
        if (userData?.employeeId) {
            setEmployeeId(userData.employeeId);
            
            const fetchData = async () => {
                try {
                    const [employeeRes, vacationsRes] = await Promise.all([
                        getEmployee(userData.employeeId),
                        getMyPlannedVacations()
                    ]);
                    
                    setEmployeeData(employeeRes.data);
                    setApprovedVacations(vacationsRes.filter(v => v.vacationStatusId === 2));
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            
            fetchData();
        }
    }, [userData]);

    useEffect(() => {
        const fetchVacationTypes = async () => {
            try {
                const types = await getVacationTypes();
                setVacationTypes(types);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching vacation types:', error);
            }
        };
        
        fetchVacationTypes();
    }, []);

    useEffect(() => {
        if (startDate && daysCount > 0) {
            const start = new Date(startDate);
            const end = new Date(start);
            end.setDate(start.getDate() + daysCount - 1);
            setEndDate(end.toISOString().split('T')[0]);
        }
    }, [startDate, daysCount]);

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const calculatedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setDaysCount(calculatedDays);
        }
    }, [endDate]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    

    const hasLongVacation = () => {
        return approvedVacations.some(vacation => {
            const start = new Date(vacation.startDate);
            const end = new Date(vacation.endDate);
            return (Math.floor((end - start) / 86400000) + 1) >= 14;
        });
    };

    const validateRequest = () => {
    if (!employeeData) return "Данные сотрудника не загружены";
    
    const totalAvailable = employeeData.accumulatedVacationDays; // Уже содержит (общее кол-во - использованные)
    const remaining = totalAvailable - daysCount;

    if (daysCount < 1) return "Минимальная продолжительность отпуска - 1 день";
    if (daysCount > totalAvailable) return `Недостаточно дней. Доступно: ${totalAvailable}`;

    const hasLongApproved = hasLongVacation();
    let minRequired = 7;

    if (!hasLongApproved) {
        if (daysCount >= 14) {
            minRequired = 7;
        } else {
            minRequired = 14;
        }
    }

    if (remaining < minRequired) {
        return `После отпуска останется ${remaining} дней. Требуется минимум ${minRequired}`;
    }

    return null;
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateRequest();
        
        if (validationError) {
            setError({ message: validationError });
            setIsErrorModalOpen(true);
            return;
        }

        try {
            const response = await createVacationRequest({
                employeeId,
                vacationTypeId,
                startDate,
                endDate,
                comment,
            });
            
            if (response.warning) {
                setWarning({
                    message: response.warning.message,
                    overlappingVacations: response.warning.overlappingVacations
                });
                setIsWarningModalOpen(true);
            } else {
                setIsModalOpen(true);
            }
            
            // Сброс формы
            setVacationTypeId(0);
            setStartDate('');
            setEndDate('');
            setDaysCount(0);
            setComment('');
        } catch (err) {
            setError({ 
                message: err.response?.data?.message || "Ошибка при отправке заявки",
                details: {
                    available: employeeData?.accumulatedVacationDays - calculateUsedVacationDays(),
                    requested: daysCount
                }
            });
            setIsErrorModalOpen(true);
        }
    };

    const calculateWorkExperience = () => {
        if (!employeeData?.hireDate) return '';
        const hire = new Date(employeeData.hireDate);
        const now = new Date();
        const years = now.getFullYear() - hire.getFullYear();
        const months = now.getMonth() - hire.getMonth();
        return `${years} лет ${months < 0 ? months + 12 : months} месяцев`;
    };

    if (loading) {
        return (
            <div className="text-center">
                <div role="status">
                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="vacation-form">
                <h2 className="form-title">Заявка на отпуск</h2>

                {employeeData && (
                    <div className="employee-info">
                        <div className="info-group">
    <label>Оставшиеся из накопленных дни отпуска:</label>
    <span className="info-value">
        {employeeData.accumulatedVacationDays} из {employeeData.totalAccumulatedVacationDays} дней
    </span>
</div>
                        <div className="info-group">
                            <label>Стаж работы:</label>
                            <span className="info-value">
                                {calculateWorkExperience()}
                            </span>
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label>Дата начала отпуска</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Количество дней:</label>
                    <input
                        type="number"
                        value={daysCount}
                        onChange={(e) => setDaysCount(Math.max(0, parseInt(e.target.value) || 0))}
                        min="1"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Дата окончания отпуска:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Тип отпуска:</label>
                    <select
                        value={vacationTypeId}
                        onChange={(e) => setVacationTypeId(Number(e.target.value))}
                        className="form-input"
                        required
                    >
                        <option value={0}>Выберите тип отпуска</option>
                        {vacationTypes.map((type) => (
                            <option key={type.vacationTypeId} value={type.vacationTypeId}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Комментарий:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="form-textarea"
                    />
                </div>

                <div className="form-checkbox">
                    <input 
                        type="checkbox" 
                        id="agree" 
                        required 
                        className="checkbox-input"
                    />
                    <label htmlFor="agree">Я согласен с условиями</label>
                </div>

                <button type="submit" className="submit-button">
                    Сохранить
                </button>
            </form>

            {isModalOpen && (
                <div className="modal5">
                    <div className="modal-content5">
                        <span className="close5" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <p>Ваша заявка успешно отправлена!</p>
                    </div>
                </div>
            )}

            {isErrorModalOpen && error && (
                <div className="modal5">
                    <div className="modal-content5 error">
                        <span className="close5" onClick={() => setIsErrorModalOpen(false)}>&times;</span>
                        <h3>Ошибка при отправке заявки</h3>
                        <p>{error.message}</p>
                        {error.details && (
                            <div className="error-details">
                                <p>Доступно дней: {error.details.available}</p>
                                <p>Запрошено дней: {error.details.requested}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isWarningModalOpen && warning && (
                <div className="modal5">
                    <div className="modal-content5 warning">
                        <span className="close5" onClick={() => setIsWarningModalOpen(false)}>&times;</span>
                        <h3>Внимание!</h3>
                        <p>{warning.message}</p>
                        <div className="overlapping-list">
                            {warning.overlappingVacations.map((vacation, index) => (
                                <div key={index} className="overlapping-item">
                                    <p>Сотрудник: {vacation.employeeName}</p>
                                    <p>Период: {formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}</p>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="confirm-button"
                            onClick={() => setIsWarningModalOpen(false)}
                        >
                            Понятно
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VacationRequestForm;