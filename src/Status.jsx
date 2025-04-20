import './Status.css';
import errorSvg from './assets/error.svg';

function Status({ error }) {
  if (!error) return null;
  
  return (
    <div className="status-container">
      <div className="status-error">
        <img src={errorSvg} alt="Error" className="status-icon" />
        <span className="status-message">{error}</span>
      </div>
    </div>
  );
}

export default Status;
