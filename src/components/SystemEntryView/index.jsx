import LoginForm from '../LoginForm';
import './style.css';

function SystemEntryView() {
  return (
    <div className="system-login-container">
      <img src="/assets/image_b07e937d.png" className="system-login-icon" alt="Login Icon" />
      <LoginForm />
    </div>
  );
}

export default SystemEntryView;
