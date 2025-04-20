import { useState, useEffect } from 'react';
import './AdminPanel.css';
import {
  fetchAllUsersAssignments,
  fetchAdminUpdateAssignment,
  fetchAdminDeleteAssignment,
  fetchSubjects,
  fetchAddSubject,
  fetchDeleteSubject,
  fetchAdminStats
} from './services';
import { formatDateForDisplay } from './validation';
import ConfirmationDialog from './ConfirmationDialog';
import Loading from './Loading';
import Status from './Status';
import AssignmentItem from './AssignmentItem';
import EditAssignmentForm from './EditAssignmentForm'; 

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('assignments');
  const [allAssignments, setAllAssignments] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [systemStats, setSystemStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingTarget, setEditingTarget] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    setEditingTarget(null);

    setLoading(true);
    setError('');
    let fetchPromise;
    const handleFetchError = (err) => setError(err?.error || 'Failed to load data');

    if (activeTab === 'assignments') {
      fetchPromise = fetchAllUsersAssignments().then(setAllAssignments);
    } else if (activeTab === 'subjects') {
      fetchPromise = fetchSubjects().then(setSubjects);
    } else if (activeTab === 'stats') {
      fetchPromise = fetchAdminStats().then(setSystemStats);
    } else {
      fetchPromise = Promise.resolve();
    }
    fetchPromise.catch(handleFetchError).finally(() => setLoading(false));
  }, [activeTab]);

  const handleToggleComplete = (username, id, completed) => {
    setError('');
    const originalAssignments = { ...allAssignments };
    setAllAssignments(prev => {
        const userAssignments = { ...(prev[username] || {}) };
        if (userAssignments[id]) {
            userAssignments[id] = { ...userAssignments[id], completed: !completed };
        }
        return { ...prev, [username]: userAssignments };
    });
    fetchAdminUpdateAssignment(username, id, { completed: !completed })
      .catch(err => {
        setError(err?.error || 'Failed to update assignment');
        setAllAssignments(originalAssignments);
      });
  };

  const handleDeleteAssignment = (username, id) => {
     const assignmentTitle = allAssignments[username]?.[id]?.title || 'this assignment';
     setConfirmDialog({
       show: true,
       message: `Are you sure you want to delete "${assignmentTitle}" for user "${username}"?`,
       onConfirm: () => {
         setConfirmDialog({ show: false, message: '', onConfirm: null });
         setError('');
         const originalAssignments = { ...allAssignments };
         setAllAssignments(prev => {
           const updatedUserAssignments = { ...(prev[username] || {}) };
           delete updatedUserAssignments[id];
           if (Object.keys(updatedUserAssignments).length === 0) {
              const updatedAll = { ...prev };
              delete updatedAll[username];
              return updatedAll;
           } else {
              return { ...prev, [username]: updatedUserAssignments };
           }
         });
         fetchAdminDeleteAssignment(username, id)
           .catch(err => {
             setError(err?.error || 'Failed to delete assignment');
             setAllAssignments(originalAssignments);
           });
       }
     });
  };

  const handleStartEdit = (username, id) => {
    setEditingTarget({ username, id });
  };

  const handleAdminCancelEdit = () => {
    setEditingTarget(null);
  };

  const handleAdminSaveEdit = (updatedData) => {
    if (!editingTarget) return;
    const { username, id } = editingTarget;
    setError('');

    fetchAdminUpdateAssignment(username, id, updatedData)
      .then(savedAssignment => {
        setAllAssignments(prev => {
          const userAssignments = { ...(prev[username] || {}) };
          userAssignments[id] = savedAssignment;
          return { ...prev, [username]: userAssignments };
        });
        setEditingTarget(null); 
      })
      .catch(err => {
        setError(err?.error || 'Failed to save assignment');
      });
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    const trimmedSubject = newSubject.trim();
    if (!trimmedSubject) {
      setError('Subject name cannot be empty');
      return;
    }
    setError('');
    fetchAddSubject(trimmedSubject)
      .then(updatedSubjects => {
        setSubjects(updatedSubjects);
        setNewSubject('');
      })
      .catch(err => {
        setError(err?.error || 'Failed to add subject');
      });
  };

  const handleDeleteSubject = (subject) => {
     setConfirmDialog({
       show: true,
       message: `Are you sure you want to delete the subject "${subject}"? This cannot be undone.`,
       onConfirm: () => {
         setConfirmDialog({ show: false, message: '', onConfirm: null });
         setError('');
         const originalSubjects = [...subjects];
         setSubjects(prev => prev.filter(s => s !== subject));
         fetchDeleteSubject(subject)
           .catch(err => {
             setError(err?.error || 'Failed to delete subject');
             setSubjects(originalSubjects);
           });
       }
     });
  };

  const cancelConfirmation = () => {
      setConfirmDialog({ show: false, message: '', onConfirm: null });
  };

  return (
    <div className="admin-panel-content card">
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
          aria-pressed={activeTab === 'assignments'}
        >
          All Assignments
        </button>
        <button
          className={`tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
          onClick={() => setActiveTab('subjects')}
          aria-pressed={activeTab === 'subjects'}
        >
          Subject Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
          aria-pressed={activeTab === 'stats'}
        >
          System Stats
        </button>
      </div>

      {error && <Status error={error} />}

      {loading ? (
        <Loading>Loading Admin Data...</Loading>
      ) : (
        <>
          {activeTab === 'assignments' && (
            <div className="all-assignments">
              <h2 className="section-title">All User Assignments</h2>
              {Object.keys(allAssignments).length === 0 ? (
                <p>No users with assignments found.</p>
              ) : (
                Object.entries(allAssignments).map(([username, assignments]) => (
                  <div key={username} className="user-assignments card">
                    <h3>User: {username}</h3>
                    {Object.keys(assignments).length === 0 ? (
                      <p style={{padding: '1rem'}}>No assignments for this user.</p>
                    ) : (
                      <div className="assignments-list">
                        {Object.values(assignments).map(assignment => {
                          const isEditing = editingTarget && editingTarget.username === username && editingTarget.id === assignment.id;
                          return isEditing ? (
                            <EditAssignmentForm
                              key={`${assignment.id}-edit`} 
                              assignment={assignment}
                              onSave={handleAdminSaveEdit}
                              onCancel={handleAdminCancelEdit}
                            />
                          ) : (
                            <AssignmentItem
                              key={assignment.id}
                              assignment={assignment}
                              onDelete={() => handleDeleteAssignment(username, assignment.id)}
                              onToggleComplete={() => handleToggleComplete(username, assignment.id, assignment.completed)}
                              onEdit={() => handleStartEdit(username, assignment.id)}
                              isAdmin={true} 
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="subjects-management">
               <h2 className="section-title">Subject Management</h2>
              <form className="add-subject-form" onSubmit={handleAddSubject}>
                <div className="form-group" style={{marginBottom: 0, flexGrow: 1}}>
                    <label htmlFor="new-subject-input" className="sr-only">New Subject Name</label>
                    <input
                      id="new-subject-input"
                      type="text"
                      className="form-control"
                      placeholder="Enter new subject name"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      required
                    />
                 </div>
                <button type="submit" className="btn btn-primary">Add Subject</button>
              </form>
              <div className="subjects-list card">
                <h3>Current Subjects</h3>
                {subjects.length === 0 ? (
                  <p style={{padding: '1rem'}}>No subjects defined.</p>
                ) : (
                  <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    {subjects.map(subject => (
                      <li key={subject} className="subject-item">
                        <span>{subject}</span>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSubject(subject)}>Delete</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && systemStats && (
             <div className="system-stats">
               <h2 className="section-title">System Statistics</h2>
               <div className="stats-summary">
                 <div className="stat-card"><h4>Total Users</h4><div className="stat-value">{systemStats.userCount ?? 'N/A'}</div></div>
                 <div className="stat-card"><h4>Total Assignments</h4><div className="stat-value">{systemStats.totalAssignments ?? 'N/A'}</div></div>
                 <div className="stat-card"><h4>Completed Assignments</h4><div className="stat-value">{systemStats.completedAssignments ?? 'N/A'}</div></div>
                 <div className="stat-card"><h4>Completion Rate</h4><div className="stat-value">{systemStats.completionRate ?? 'N/A'}%</div></div>
               </div>
               <div className="stats-details">
                 <div className="stats-by-subject card">
                   <h3>Assignments by Subject</h3>
                   {systemStats.assignmentsBySubject && Object.keys(systemStats.assignmentsBySubject).length === 0 ? (
                     <p style={{padding: '1rem'}}>No assignments with subjects found.</p>
                   ) : (
                     <table className="stats-table">
                       <thead>
                         <tr><th>Subject</th><th>Total</th><th>Completed</th><th>Rate</th></tr>
                       </thead>
                       <tbody>
                         {systemStats.assignmentsBySubject && Object.entries(systemStats.assignmentsBySubject).map(([subject, data]) => (
                           <tr key={subject}>
                             <td>{subject}</td>
                             <td>{data.total}</td>
                             <td>{data.completed}</td>
                             <td>{data.total ? ((data.completed / data.total) * 100).toFixed(1) : 0}%</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   )}
                 </div>
                 <div className="stats-by-user card">
                   <h3>Assignments by User</h3>
                   {systemStats.assignmentsByUser && Object.keys(systemStats.assignmentsByUser).length === 0 ? (
                     <p style={{padding: '1rem'}}>No user assignment data available.</p>
                   ) : (
                     <table className="stats-table">
                       <thead>
                         <tr><th>User</th><th>Total</th><th>Completed</th><th>Rate</th></tr>
                       </thead>
                       <tbody>
                         {systemStats.assignmentsByUser && Object.entries(systemStats.assignmentsByUser).map(([user, data]) => (
                           <tr key={user}>
                             <td>{user}</td>
                             <td>{data.total}</td>
                             <td>{data.completed}</td>
                             <td>{data.total ? ((data.completed / data.total) * 100).toFixed(1) : 0}%</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   )}
                 </div>
               </div>
             </div>
          )}
        </>
      )}

      {confirmDialog.show && (
        <ConfirmationDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={cancelConfirmation}
        />
      )}
    </div>
  );
}

export default AdminPanel;
