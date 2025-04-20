import './Controls.css';
import logoutSvg from './assets/logout.svg';

function Controls({ onLogout }) { 

  return (
    <>
      <div className="controls">
        <div className="controls-left"></div>

        <div className="controls-right">
          <button className="btn btn-danger logout-btn" onClick={onLogout}>
            <img src={logoutSvg} alt="Logout" className="control-icon" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Controls;
