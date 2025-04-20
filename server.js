import express from 'express';
import cookieParser from 'cookie-parser';
import assignments from './assignments.js';
import sessions from './sessions.js';
import users from './users.js';
import permissions from './permissions.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('./dist'));
app.use(express.json());

app.get('/api/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  res.json({ username });
});

app.post('/api/session', (req, res) => {
  const { username } = req.body;

  if (!users.isValid(username)) {
    res.status(400).json({ error: 'required-username' });
    return;
  }

  if (username === 'dog') {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const existingUserData = users.getUserData(username);
  if (!existingUserData) {
    res.status(403).json({ error: 'auth-nouser', message: 'Username not found. Please register first.' });
    return;
  }

  const sid = sessions.addSession(username);
  res.cookie('sid', sid);
  res.json(existingUserData.getAssignments());
});


app.delete('/api/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if(sid) {
    res.clearCookie('sid');
  }

  if(username) {
    sessions.deleteSession(sid);
  }

  res.json({ username });
});

app.get('/api/assignments', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  
  const { status, subject, sort } = req.query;
  const assignmentList = users.getUserData(username);
  let assignments = assignmentList.getAssignments();
  
  if(status || subject || sort) {
    assignments = assignmentList.getFilteredAssignments(status, subject, sort);
  }
  
  res.json(assignments);
});

app.post('/api/assignments', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  
  const { title, subject, dueDate, description } = req.body;
  
  if(!title || !dueDate) {
    res.status(400).json({ error: 'required-fields-missing' });
    return;
  }
  
  if(new Date(dueDate).toString() === 'Invalid Date') {
    res.status(400).json({ error: 'invalid-date' });
    return;
  }
  
  const assignmentList = users.getUserData(username);
  const id = assignmentList.addAssignment(title, subject, dueDate, description);
  res.json(assignmentList.getAssignment(id));
});

app.get('/api/assignments/:id', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  
  const assignmentList = users.getUserData(username);
  const { id } = req.params;
  
  if(!assignmentList.contains(id)) {
    res.status(404).json({ error: 'noSuchId', message: `No assignment with id ${id}` });
    return;
  }
  
  res.json(assignmentList.getAssignment(id));
});

app.put('/api/assignments/:id', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  
  const assignmentList = users.getUserData(username);
  const { id } = req.params;
  const { title, subject, dueDate, description, completed } = req.body;
  
  if(!title || !dueDate) {
    res.status(400).json({ error: 'required-fields-missing' });
    return;
  }
  
  if(new Date(dueDate).toString() === 'Invalid Date') {
    res.status(400).json({ error: 'invalid-date' });
    return;
  }
  
  if(!assignmentList.contains(id)) {
    res.status(404).json({ error: 'noSuchId', message: `No assignment with id ${id}` });
    return;
  }
  
  assignmentList.updateAssignment(id, { title, subject, dueDate, description, completed });
  res.json(assignmentList.getAssignment(id));
});

app.patch('/api/assignments/:id', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  
  const assignmentList = users.getUserData(username);
  const { id } = req.params;
  const { title, subject, dueDate, description, completed } = req.body;
  
  if(dueDate && new Date(dueDate).toString() === 'Invalid Date') {
    res.status(400).json({ error: 'invalid-date' });
    return;
  }
  
  if(!assignmentList.contains(id)) {
    res.status(404).json({ error: 'noSuchId', message: `No assignment with id ${id}` });
    return;
  }
  
  assignmentList.updateAssignment(id, { title, subject, dueDate, description, completed });
  res.json(assignmentList.getAssignment(id));
});

app.delete('/api/assignments/:id', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  
  const { id } = req.params;
  const assignmentList = users.getUserData(username);
  const exists = assignmentList.contains(id);
  
  if(exists) {
    assignmentList.deleteAssignment(id);
  }
  
  res.json({ message: exists ? `assignment ${id} deleted` : `assignment ${id} did not exist` });
});

app.get('/api/stats', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  
  const assignmentList = users.getUserData(username);
  const stats = assignmentList.getStats();
  res.json(stats);
});

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  
  if(!users.isValid(username)) {
    res.status(400).json({ error: 'required-username' });
    return;
  }
  
  if(username === 'dog') {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }
  
  if(users.getUserData(username)) {
    res.status(409).json({ error: 'username-exists' });
    return;
  }
  
  users.addUserData(username, assignments.makeAssignmentList());
  const sid = sessions.addSession(username);
  
  res.cookie('sid', sid);
  res.json(users.getUserData(username).getAssignments());
});

app.get('/api/admin/assignments', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  if (!permissions.isAdmin(username)) {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const allAssignments = {};
  for (const user in users.getAllUserData()) {
    const userData = users.getUserData(user);
    allAssignments[user] = userData.getAssignments();
  }

  res.json(allAssignments);
});

app.patch('/api/admin/assignments/:username/:id', (req, res) => {
  const sid = req.cookies.sid;
  const adminUsername = sid ? sessions.getSessionUser(sid) : '';

  if (!sid || !users.isValid(adminUsername)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  if (!permissions.isAdmin(adminUsername)) {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const { username, id } = req.params;
  const { title, subject, dueDate, description, completed } = req.body;

  if (!users.getUserData(username)) {
    res.status(404).json({ error: 'user-not-found' });
    return;
  }

  const assignmentList = users.getUserData(username);

  if (!assignmentList.contains(id)) {
    res.status(404).json({ error: 'noSuchId', message: `No assignment with id ${id}` });
    return;
  }

  assignmentList.updateAssignment(id, { title, subject, dueDate, description, completed });
  res.json(assignmentList.getAssignment(id));
});

app.delete('/api/admin/assignments/:username/:id', (req, res) => {
  const sid = req.cookies.sid;
  const adminUsername = sid ? sessions.getSessionUser(sid) : '';

  if (!sid || !users.isValid(adminUsername)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  if (!permissions.isAdmin(adminUsername)) {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const { username, id } = req.params;

  if (!users.getUserData(username)) {
    res.status(404).json({ error: 'user-not-found' });
    return;
  }

  const assignmentList = users.getUserData(username);
  const exists = assignmentList.contains(id);

  if (exists) {
    assignmentList.deleteAssignment(id);
  }

  res.json({ message: exists ? `assignment ${id} deleted` : `assignment ${id} did not exist` });
});

app.get('/api/subjects', (req, res) => {
  const subjects = permissions.getSubjects();
  res.json(subjects);
});

app.post('/api/admin/subjects', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  if (!permissions.isAdmin(username)) {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const { subject } = req.body;

  if (!subject) {
    res.status(400).json({ error: 'required-subject' });
    return;
  }

  const success = permissions.addSubject(subject);
  if (success) {
    res.json(permissions.getSubjects());
  } else {
    res.status(409).json({ error: 'subject-exists' });
  }
});

app.delete('/api/admin/subjects/:subject', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  if (!permissions.isAdmin(username)) {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const { subject } = req.params;
  const success = permissions.removeSubject(subject);

  if (success) {
    res.json(permissions.getSubjects());
  } else {
    res.status(404).json({ error: 'subject-not-found' });
  }
});

app.get('/api/admin/stats', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  if (!permissions.isAdmin(username)) {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const userData = users.getAllUserData();
  const userCount = Object.keys(userData).length;

  let totalAssignments = 0;
  let completedAssignments = 0;
  const assignmentsBySubject = {};
  const assignmentsByUser = {};

  for (const username in userData) {
    const assignments = userData[username].getAssignments();
    const assignmentCount = Object.keys(assignments).length;
    const userCompletedCount = Object.values(assignments).filter(a => a.completed).length;

    totalAssignments += assignmentCount;
    completedAssignments += userCompletedCount;
    assignmentsByUser[username] = {
      total: assignmentCount,
      completed: userCompletedCount
    };

    Object.values(assignments).forEach(assignment => {
      const subject = assignment.subject || 'Uncategorized';
      if (!assignmentsBySubject[subject]) {
        assignmentsBySubject[subject] = { total: 0, completed: 0 };
      }
      assignmentsBySubject[subject].total++;
      if (assignment.completed) {
        assignmentsBySubject[subject].completed++;
      }
    });
  }

  res.json({
    userCount,
    totalAssignments,
    completedAssignments,
    completionRate: totalAssignments ? (completedAssignments / totalAssignments * 100).toFixed(1) : 0,
    assignmentsBySubject,
    assignmentsByUser
  });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
