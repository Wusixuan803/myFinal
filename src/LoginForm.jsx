import { useState } from 'react';
import { isValidUsername } from './validation';
import './LoginForm.css';
import personSvg from './assets/person.svg';
import loginSvg from './assets/login.svg';
import accountSvg from './assets/account.svg'; 

function LoginForm({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isValidUsername(username)) {
      setError('Username must contain only letters, numbers, and underscores');
      return;
    }
    
    onLogin(username);
  };

  return (
    <div className="login-container">
      <div className="login-form-container card">
        <div className="login-header">
          <img src={accountSvg} alt="Login" className="login-icon" />
          <h2 className="login-title">Login to Assignment Tracker</h2>
          <p className="login-subtitle">
            Keep track of your assignments, deadlines, and progress
          </p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <div className="input-wrapper">
              <img src={personSvg} alt="User" className="input-icon" />
              <input
                type="text"
                id="username"
                className={`form-control ${error ? 'is-invalid' : ''}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>
            {error && <div className="error-text">{error}</div>}
          </div>
          
          <div className="login-actions">
            <button type="submit" className="btn login-btn">
              <img src={loginSvg} alt="Login" className="button-icon" />
              Login
            </button>
          </div>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account?</p>
          <button
            type="button"
            className="btn-link"
            onClick={onSwitchToRegister}
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;