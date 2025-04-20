const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

const userRoles = {
  admin: ROLES.ADMIN,
};

let subjects = [
  "Application Modeling & Design",
  "Intro to Python for Info Sys",
  "Application Engineer & Dev",
  "Lab for Application Engineer & Dev",
  "Web Development Tools & Methods",
  "Adv Techniques With LLM"
];

function isAdmin(username) {
  return userRoles[username] === ROLES.ADMIN;
}

function assignRole(username, role) {
  if (Object.values(ROLES).includes(role)) {
    userRoles[username] = role;
    return true;
  }
  return false;
}

function getUserRole(username) {
  return userRoles[username] || ROLES.USER;
}

function getSubjects() {
  return [...subjects];
}

function addSubject(subject) {
  if (!subjects.includes(subject)) {
    subjects.push(subject);
    return true;
  }
  return false;
}

function removeSubject(subject) {
  const index = subjects.indexOf(subject);
  if (index !== -1) {
    subjects.splice(index, 1);
    return true;
  }
  return false;
}

function hasPermission(username, action) {
  const role = getUserRole(username);
  const permissions = {
    [ROLES.ADMIN]: ['read', 'write', 'delete', 'stats', 'manageUsers', 'manageSubjects', 'viewAllAssignments'],
    [ROLES.USER]: ['read', 'write', 'delete', 'stats'],
  };
  return permissions[role]?.includes(action) || false;
}

export default {
  ROLES,
  isAdmin,
  assignRole,
  getUserRole,
  hasPermission,
  getSubjects,
  addSubject,
  removeSubject
};
