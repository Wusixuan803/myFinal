export function isValidUsername(username) {
  return username && username.trim() && /^[A-Za-z0-9_]+$/.test(username);
}

export function isValidTitle(title) {
  return title && title.trim();
}

export function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function isPastDate(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);
  return date < today;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

export function formatDateForDisplay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getDaysRemaining(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
