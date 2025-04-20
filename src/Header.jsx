import './Header.css';
import personSvg from './assets/person.svg';
import assignmentSvg from './assets/assignment.svg';

function Header({ username, isLoggedIn, isAdmin }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src={assignmentSvg} alt="Logo" className="logo-icon" />
          <h1 className="logo-text">Assignment Tracker</h1>
        </div>
        {isLoggedIn && (
          <div className="user-info">
            <img src={personSvg} alt="User" className="user-icon" />
            <span className="username">{username}</span>
            {isAdmin && <span className="admin-badge">Admin</span>}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;