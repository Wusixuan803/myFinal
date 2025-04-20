export const LOGIN_STATUS = {
  PENDING: "pending",
  NOT_LOGGED_IN: "notLoggedIn",
  IS_LOGGED_IN: "loggedIn",
};

export const SERVER = {
  AUTH_MISSING: "auth-missing",
  AUTH_NOUSER: "auth-nouser",
  AUTH_INSUFFICIENT: "auth-insufficient",
  REQUIRED_USERNAME: "required-username",
  REQUIRED_FIELDS_MISSING: "required-fields-missing",
  INVALID_DATE: "invalid-date",
  USERNAME_EXISTS: 'username-exists',
};

export const CLIENT = {
  NETWORK_ERROR: "networkError",
  NO_SESSION: "noSession",
  UNKNOWN_ERROR: "unknownError",
};

export const MESSAGES = {
  [SERVER.AUTH_MISSING]: "You must be logged in to access this feature",
  [SERVER.AUTH_NOUSER]: "Username not found. Please register first",
  [SERVER.AUTH_INSUFFICIENT]: "This username is not allowed. Please choose another username",
  [SERVER.REQUIRED_USERNAME]: "Please enter a valid username",
  [SERVER.REQUIRED_FIELDS_MISSING]: "Please fill in all required fields",
  [SERVER.INVALID_DATE]: "Please enter a valid date",
  [SERVER.USERNAME_EXISTS]: "Username already exists. Please choose another or log in.",
  [CLIENT.NETWORK_ERROR]: "Network error, please try again",
  [CLIENT.NO_SESSION]: "Session information is missing. Please log in",
  default: "Something went wrong, please try again",
};

export const POLLING_DELAY = 5000;

export const ASSIGNMENT_STATUS = {
  ALL: "all",
  PENDING: "pending",
  COMPLETED: "completed",
};
