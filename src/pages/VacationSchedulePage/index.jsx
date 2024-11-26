import VacationItems from "../../components/VacationItems";
import "./style.css";

function VacationSchedule() {
  return (
    <div className="vacation-schedule-container">
          <VacationItems />
          <VacationItems />
          <VacationItems />
    </div>
  );
}

export default VacationSchedule;