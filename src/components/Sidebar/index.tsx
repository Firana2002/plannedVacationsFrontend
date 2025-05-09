import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Sidebar = () => {
  const menuItems = [
    { icon: '/images/заявки.png', text: 'График отпусков', path: '/vacation-days' },
    { icon: '/images/сотруд.png', text: 'Сотрудники', path: '/employees' },
    { icon: '/images/полф.png', text: 'Мой профиль', path: '/profile' },
    /*{ icon: '/images/заявки.svg', text: 'Подать заявку', path: '/create-vacation' },*/
    { icon: '/images/написать_заявку.png', text: 'Все заявки', path: '/all-vacations' },
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul className="menu">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path} className="menu-item">
                <img src={item.icon} alt={item.text} />
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;