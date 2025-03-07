import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PersonalDataDisplay from '@/components/PersonalData';
import GeneralData from '@/components/GeneralData';
import { getEmployee } from '@/api/employees';

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const { id } = useParams(); // Получаем id из URL
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployee(id);
        setEmployee(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full">
      <div className="border-b border-gray-300">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 ${value === 0 ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
            onClick={() => setValue(0)}
          >
            Личные данные
          </button>
          <button
            className={`py-2 px-4 ${value === 1 ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
            onClick={() => setValue(1)}
          >
            Общая информация
          </button>
        </div>
      </div>
      <div className="p-3">
        {value === 0 && <PersonalDataDisplay data={employee} />}
        {value === 1 && <GeneralData />}
      </div>
    </div>
  );
}
