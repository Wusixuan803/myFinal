import './AssignmentItem.css';
import { formatDateForDisplay, getDaysRemaining, isPastDate } from './validation';
import editSvg from './assets/edit.svg';
import deleteSvg from './assets/delete.svg';

function AssignmentItem({ assignment, onDelete, onToggleComplete, onEdit, isAdmin }) {
  const { id, title, subject, dueDate, description, completed } = assignment;
  
  const daysRemaining = getDaysRemaining(dueDate);
  const isOverdue = !completed && isPastDate(dueDate);
  
  let statusTagClass = 'status-tag-pending';
  let statusText = `${Math.abs(daysRemaining)} days remaining`;
  
  if (completed) {
    statusTagClass = 'status-tag-completed';
    statusText = 'Completed';
  } else if (isOverdue) {
    statusTagClass = 'status-tag-overdue';
    statusText = `${Math.abs(daysRemaining)} days overdue`;
  } else if (daysRemaining <= 2) {
    statusTagClass = 'status-tag-urgent';
    statusText = daysRemaining === 0 ? 'Due today' : 
                (daysRemaining === 1 ? 'Due tomorrow' : `${daysRemaining} days remaining`);
  }
  
  return (
    <div className={`assignment-item ${completed ? 'completed' : ''} ${isAdmin ? 'admin-view' : ''}`}>
      <div className="assignment-main">
        <div className="assignment-checkbox-container">
          <input 
            type="checkbox" 
            id={`assignment-${id}`}
            className="assignment-checkbox"
            checked={completed}
            onChange={onToggleComplete}
          />
          <label 
            htmlFor={`assignment-${id}`}
            className="assignment-checkbox-label"
          >
            <span className="sr-only">
              Mark as {completed ? 'incomplete' : 'complete'}
            </span>
          </label>
        </div>
        
        <div className="assignment-content">
          <h3 className="assignment-title">
            {title}
            {isAdmin && <span className="admin-edit-badge">Admin</span>}
          </h3>
          
          <div className="assignment-details">
            {subject && (
              <span className="assignment-subject">{subject}</span>
            )}
            
            <span className="assignment-due-date">
              Due: {formatDateForDisplay(dueDate)}
            </span>
            
            <span className={`assignment-status ${statusTagClass}`}>
              {statusText}
            </span>
          </div>
          
          {description && (
            <p className="assignment-description">{description}</p>
          )}
        </div>
      </div>
      
      <div className="assignment-actions">
        <button 
          className="assignment-action edit-btn" 
          onClick={onEdit}
          aria-label="Edit assignment"
        >
          <img src={editSvg} alt="Edit" className="action-icon" />
        </button>
        
        <button 
          className="assignment-action delete-btn" 
          onClick={onDelete}
          aria-label="Delete assignment"
        >
          <img src={deleteSvg} alt="Delete" className="action-icon" />
        </button>
      </div>
    </div>
  );
}

export default AssignmentItem;