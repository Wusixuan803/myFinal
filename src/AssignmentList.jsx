import { useState } from 'react';
import './AssignmentList.css';
import AssignmentItem from './AssignmentItem';
import EditAssignmentForm from './EditAssignmentForm';
import Pagination from './Pagination';
import { ACTIONS } from './assignmentReducer';
import { fetchDeleteAssignment, fetchUpdateAssignment } from './services';
import pendingSvg from './assets/pending.svg';
import ConfirmationDialog from './ConfirmationDialog';

function AssignmentList({ 
  assignments, 
  isLoading, 
  lastAddedId, 
  page,
  totalPages,
  onPageChange,
  dispatch,
  isAdmin
}) {
  const [editingId, setEditingId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '', onConfirm: null });

  const handleDelete = (id) => {
    setConfirmDialog({
      show: true,
      message: 'Are you sure you want to delete this assignment?',
      onConfirm: () => {
        setConfirmDialog({ show: false, message: '', onConfirm: null });
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });

        fetchDeleteAssignment(id)
          .then(() => {
            dispatch({ type: ACTIONS.DELETE_ASSIGNMENT, payload: id });
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
          })
          .catch(err => {
            dispatch({ 
              type: ACTIONS.SET_ERROR, 
              payload: err?.error || 'Failed to delete assignment' 
            });
          });
      }
    });
  };

  const handleToggleComplete = (id, completed) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    fetchUpdateAssignment(id, { completed: !completed })
      .then(updatedAssignment => {
        dispatch({ 
          type: ACTIONS.UPDATE_ASSIGNMENT, 
          payload: updatedAssignment 
        });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      })
      .catch(err => {
        dispatch({ 
          type: ACTIONS.SET_ERROR, 
          payload: err?.error || 'Failed to update assignment' 
        });
      });
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id, updatedAssignment) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    fetchUpdateAssignment(id, updatedAssignment)
      .then(updatedAssignment => {
        dispatch({ 
          type: ACTIONS.UPDATE_ASSIGNMENT, 
          payload: updatedAssignment 
        });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        setEditingId(null);
      })
      .catch(err => {
        dispatch({ 
          type: ACTIONS.SET_ERROR, 
          payload: err?.error || 'Failed to update assignment' 
        });
      });
  };

  return (
    <div className="assignment-list card">
      <div className="assignment-list-header">
        <h2 className="section-title">Assignments</h2>
        {isAdmin && (
          <div className="admin-tag">Admin View</div>
        )}
      </div>

      {isLoading ? (
        <div className="assignments-loading">
          <div className="spinner"></div>
          <p>Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="no-assignments">
          <img src={pendingSvg} alt="No assignments" className="empty-icon" />
          <p>No assignments found. Add one to get started!</p>
        </div>
      ) : (
        <>
          <div className="assignments-container">
            {assignments.map(assignment => (
              <div 
                key={assignment.id} 
                className={`assignment-item-container ${lastAddedId === assignment.id ? 'highlight' : ''}`}
              >
                {editingId === assignment.id ? (
                  <EditAssignmentForm 
                    assignment={assignment}
                    onSave={(updates) => handleSaveEdit(assignment.id, updates)}
                    onCancel={handleCancelEdit}
                    isAdmin={isAdmin}
                  />
                ) : (
                  <AssignmentItem 
                    assignment={assignment}
                    onDelete={() => handleDelete(assignment.id)}
                    onToggleComplete={() => handleToggleComplete(assignment.id, assignment.completed)}
                    onEdit={() => handleEdit(assignment.id)}
                    isAdmin={isAdmin}
                  />
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}

      {confirmDialog.show && (
        <ConfirmationDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ show: false, message: '', onConfirm: null })}
        />
      )}
    </div>
  );
}

export default AssignmentList;
