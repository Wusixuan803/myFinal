import { useState } from 'react';
import { isValidUsername } from './validation';
import './RegisterForm.css';
import personSvg from './assets/person.svg';
import addSvg from './assets/add.svg';

function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isValidUsername(username)) {
      setError('Username must contain only letters, numbers, and underscores');
      return;
    }
    
    onRegister(username);
  };

  return (
    <div className="register-container">
      <div className="register-form-container card">
        <div className="register-header">
          <img src={personSvg} alt="User" className="register-icon" />
          <h2 className="register-title">Create an Account</h2>
          <p className="register-subtitle">
            Join Assignment Tracker to manage your tasks efficiently
          </p>
        </div>
        
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Choose a Username:</label>
            <div className="input-wrapper">
              <img src={personSvg} alt="User" className="input-icon" />
              <input
                type="text"
                id="username"
                className={`form-control ${error ? 'is-invalid' : ''}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a username"
                autoComplete="username"
                required
              />
            </div>
            {error && <div className="error-text">{error}</div>}
          </div>
          
          <div className="register-actions">
            <button type="submit" className="btn register-btn">
              <img src={addSvg} alt="Add" className="button-icon" />
              Register
            </button>
          </div>
        </form>
        
        <div className="register-footer">
          <p>Already have an account?</p>
          <button
            type="button"
            className="btn-link"
            onClick={onSwitchToLogin}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
