import React from 'react';
import { Link } from 'react-router-dom';
import "./style.css";

function Sidebar() {
  const menuItems = [
    { src: "/assets/grafic.svg", alt: "График отпусков", text: "График отпусков", path: "/schedule" },
    { src: "/assets/users.svg", alt: "Сотрудники", text: "Сотрудники", path: "/employees" },
    { src: "/assets/profile.svg", alt: "Мой профиль", text: "Мой профиль", path: "/" },
  ];

  return (
    <div className="main-content-container">
      <div className="horizontal-flex-container">
        <img src="/assets/logo.svg" alt="Logo" />
        <p className="v-planner-title">V.PLANNER</p>
      </div>
      <ul>
        {menuItems.map((item, index) => (
            <Link to={item.path} key={index} className="flex-row-with-image">
              <img src={item.src} alt={item.alt} className="image-container" />
              <p className="menu-item-text">{item.text}</p>
            </Link>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
