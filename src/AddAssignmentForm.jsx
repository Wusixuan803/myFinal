import { useState, useEffect } from 'react';
import './AddAssignmentForm.css';
import NewIcon from './assets/new.svg'; 
import { fetchAddAssignment, fetchSubjects, fetchAddSubject } from './services';
import { isValidTitle, isValidDate, formatDate } from './validation';
import { ACTIONS } from './assignmentReducer';

function AddAssignmentForm({ dispatch, isAdmin }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState(formatDate(new Date()));
  const [description, setDescription] = useState('');
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
        dispatch({ type: ACTIONS.SET_ERROR, payload: err?.error || 'Failed to add subject' });
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
    if (!validate()) return;
    const newAssignment = { title, subject, dueDate, description };
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    setErrors({});
    fetchAddAssignment(newAssignment)
      .then((assignment) => {
        dispatch({ type: ACTIONS.ADD_ASSIGNMENT, payload: assignment });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        setTitle('');
        setSubject('');
        setDueDate(formatDate(new Date()));
        setDescription('');
        setErrors({});
        setIsExpanded(false);
      })
      .catch((err) => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: err?.error || 'Failed to add assignment',
        });
      });
  };

  const toggleForm = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
         setErrors({});
    }
  };

  return (
    <div className="add-assignment-form card">
      <button type="button" className="toggle-form-btn" onClick={toggleForm} aria-expanded={isExpanded}>
        <img
          src={NewIcon}
          alt=""
          className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}
          aria-hidden="true"
        />
        {isExpanded ? 'Cancel Adding Assignment' : 'Add New Assignment'}
      </button>

      {isExpanded && (
        <form className="assignment-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="add-title">Title *</label>
              <input
                type="text"
                id="add-title"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter assignment title"
                required
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "add-title-error" : undefined}
              />
              {errors.title && <div id="add-title-error" className="error-text">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="add-subject">Subject</label>
              <select
                id="add-subject"
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
              <label htmlFor="add-dueDate">Due Date *</label>
              <input
                type="date"
                id="add-dueDate"
                className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                aria-invalid={!!errors.dueDate}
                aria-describedby={errors.dueDate ? "add-dueDate-error" : undefined}
              />
              {errors.dueDate && <div id="add-dueDate-error" className="error-text">{errors.dueDate}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="add-description">Description</label>
            <textarea
              id="add-description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              rows="3"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              Add Assignment
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddAssignmentForm;
