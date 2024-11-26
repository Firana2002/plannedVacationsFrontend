import "./style.css";

function PersonalDataDisplay({data}) {
    const personalInfoDataList = [
        { label: "Имя", value: data.nameEmployees },
        { label: "Отдел", value: data.department.nameDepartments },
    ];

    return (
        <div className="personal-info-container">
            {personalInfoDataList.map((data, index) => (
                <div className="personal-info" key={index}>
                    <p className="personal-info-label">{data.label}</p>
                    <p className="personal-info-full-name">{data.value}</p>
                </div>
            ))}
        </div>
    );
}

export default PersonalDataDisplay;
