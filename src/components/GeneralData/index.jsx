import "./style.css";
import VacationScheduleTable from "../VacationScheduleTable";

function GeneralData() {
  const personalInfoList = [
    {
      label: "Накоплено дней в отпуске",
      value: "0",
      isHighlighted: true,
    },
    {
      label: "Следующие отпуска",
      value: "Не найдено ближайших отпусков",
    },
  ];

  return (
    <div className="personal-info-container">
      {personalInfoList.map((info, index) => (
        <div className="personal-info" key={index}>
          <p className="personal-info-label">{info.label}</p>
          <p className={`personal-info-value ${info.isHighlighted ? 'personal-days' : ''}`}>
            {info.value}
          </p>
        </div>
      ))}
      <VacationScheduleTable />
    </div>
  );
}

export default GeneralData;
