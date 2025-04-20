import { useState, useEffect } from 'react';
import './EditAssignmentForm.css'; 
import { isValidTitle, isValidDate } from './validation';
import { fetchSubjects, fetchAddSubject } from './services';

function EditAssignmentForm({ assignment, onSave, onCancel, isAdmin }) {
  const [title, setTitle] = useState(assignment.title);
  const [subject, setSubject] = useState(assignment.subject || '');
  const [dueDate, setDueDate] = useState(assignment.dueDate);
  const [description, setDescription] = useState(assignment.description || '');
  const [errors, setErrors] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    fetchSubjects().then(setSubjects).catch(() => {});
  }, []);

  const handleAddSubject = () => {
    if (!newSubject.trim()) return;
    fetchAddSubject(newSubject.trim())
      .then(updatedSubjects => {
        setSubjects(updatedSubjects);
        setSubject(newSubject.trim());
        setNewSubject('');
      })
      .catch(err => {
         console.error("Failed to add subject (might require admin)", err);
      });
  };

  const validate = () => {
    const newErrors = {};
    if (!isValidTitle(title)) {
      newErrors.title = 'Title is required';
    }
    if (!isValidDate(dueDate)) {
      newErrors.dueDate = 'Please enter a valid date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    onSave({
      title,
      subject,
      dueDate,
      description,
    });
  };

  return (
    <div className="edit-assignment-form">
      <h3 className="edit-form-title">Edit Assignment</h3>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor={`edit-title-${assignment.id}`}>Title *</label>
            <input
              type="text"
              id={`edit-title-${assignment.id}`} 
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assignment title"
              required
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? `edit-title-${assignment.id}-error` : undefined}
            />
            {errors.title && <div id={`edit-title-${assignment.id}-error`} className="error-text">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor={`edit-subject-${assignment.id}`}>Subject</label>
            <select
              id={`edit-subject-${assignment.id}`} 
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Select a subject (Optional)</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
             {isAdmin && (
                <div className="add-subject-inline">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add new subject"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    aria-label="Add new subject"
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddSubject}>Add</button>
                </div>
              )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor={`edit-dueDate-${assignment.id}`}>Due Date *</label>
            <input
              type="date"
              id={`edit-dueDate-${assignment.id}`} 
              className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
              required
              aria-invalid={!!errors.dueDate}
              aria-describedby={errors.dueDate ? `edit-dueDate-${assignment.id}-error` : undefined}
            />
            {errors.dueDate && <div id={`edit-dueDate-${assignment.id}-error`} className="error-text">{errors.dueDate}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor={`edit-description-${assignment.id}`}>Description</label>
          <textarea
            id={`edit-description-${assignment.id}`} 
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
            rows="3"
          ></textarea>
        </div>

        <div className="edit-form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAssignmentForm;
