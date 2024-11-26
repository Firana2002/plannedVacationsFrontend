import SystemEntryView from "@/components/SystemEntryView";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useEffect } from "react";

function ComponentYouSelected() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      console.log(user)
      navigate(`/home/${user.id}`);
    }
  }, [user, navigate]);
  return (
    <div className="system-login-container1">
        <SystemEntryView />
        <div className="footer-links-container">
          <p className="header-link">Copyright © 2024 IPJSC EN+ GROUP</p>
          <div className="navigation-links-container">
            <p className="header-link">О Приложении</p>
            <p className="header-link">Правила</p>
            <p className="header-link">Для бизнеса</p>
            <p className="header-link">Разработчикам</p>
            <p className="header-link">Русский/English</p>
          </div>
        </div>
      </div>
  );
}

export default ComponentYouSelected;