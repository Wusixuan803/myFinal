export const initialState = {
  assignments: {},
  isLoading: false,
  error: "",
  filter: {
    status: "all",
    subject: "",
    search: "",
  },
  sort: "dueDate",
  page: 1,
  itemsPerPage: 5,
  lastAddedId: "",
};

export const ACTIONS = {
  SET_ASSIGNMENTS: "setAssignments",
  ADD_ASSIGNMENT: "addAssignment",
  UPDATE_ASSIGNMENT: "updateAssignment",
  DELETE_ASSIGNMENT: "deleteAssignment",
  SET_LOADING: "setLoading",
  SET_ERROR: "setError",
  SET_FILTER: "setFilter",
  SET_SORT: "setSort",
  SET_PAGE: "setPage",
  SET_LAST_ADDED: "setLastAdded",
  RESET: "reset",
};

export function assignmentReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_ASSIGNMENTS:
      return {
        ...state,
        assignments: action.payload,
        lastAddedId: "",
      };

    case ACTIONS.ADD_ASSIGNMENT:
      return {
        ...state,
        assignments: {
          ...state.assignments,
          [action.payload.id]: action.payload,
        },
        lastAddedId: action.payload.id,
      };

    case ACTIONS.UPDATE_ASSIGNMENT:
      return {
        ...state,
        assignments: {
          ...state.assignments,
          [action.payload.id]: {
            ...state.assignments[action.payload.id],
            ...action.payload,
          },
        },
        lastAddedId: "",
      };

    case ACTIONS.DELETE_ASSIGNMENT:
      const newAssignments = { ...state.assignments };
      delete newAssignments[action.payload];
      return {
        ...state,
        assignments: newAssignments,
        lastAddedId: "",
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload,
        },
        page: 1, 
      };

    case ACTIONS.SET_SORT:
      return {
        ...state,
        sort: action.payload,
      };

    case ACTIONS.SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };

    case ACTIONS.SET_LAST_ADDED:
      return {
        ...state,
        lastAddedId: action.payload,
      };

    case ACTIONS.RESET:
      return initialState;

    default:
      return state;
  }
}

export function getFilteredAssignments(state) {
  const { assignments, filter, sort } = state;

  let filteredAssignments = Object.values(assignments);

  if (filter.status !== "all") {
    const isCompleted = filter.status === "completed";
    filteredAssignments = filteredAssignments.filter(
      (assignment) => assignment.completed === isCompleted
    );
  }

  if (filter.subject) {
    filteredAssignments = filteredAssignments.filter(
      (assignment) => assignment.subject === filter.subject
    );
  }

  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filteredAssignments = filteredAssignments.filter(
      (assignment) =>
        assignment.title.toLowerCase().includes(searchLower) ||
        (assignment.description &&
          assignment.description.toLowerCase().includes(searchLower)) ||
        (assignment.subject &&
          assignment.subject.toLowerCase().includes(searchLower))
    );
  }

  if (sort === "dueDate") {
    filteredAssignments.sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    );
  } else if (sort === "title") {
    filteredAssignments.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "subject") {
    filteredAssignments.sort((a, b) =>
      (a.subject || "").localeCompare(b.subject || "")
    );
  }

  return filteredAssignments;
}

export function getPaginatedAssignments(
  filteredAssignments,
  page,
  itemsPerPage
) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredAssignments.slice(startIndex, endIndex);
}

export function getUniqueSubjects(assignments) {
  const subjects = Object.values(assignments)
    .map((assignment) => assignment.subject)
    .filter((subject) => subject);

  return [...new Set(subjects)].sort();
}
