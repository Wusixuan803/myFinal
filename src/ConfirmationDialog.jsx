import './ConfirmationDialog.css';

function ConfirmationDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-box">
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-buttons">
          <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;
