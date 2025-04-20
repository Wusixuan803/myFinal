import { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import './App.css';
import {
  LOGIN_STATUS,
  CLIENT,
  SERVER,
  POLLING_DELAY,
  MESSAGES,
} from './constants';
import {
  fetchSession,
  fetchLogin,
  fetchLogout,
  fetchAssignments,
  fetchStats,
  fetchRegister,
} from './services';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Loading from './Loading';
import Header from './Header';
import AssignmentList from './AssignmentList';
import AddAssignmentForm from './AddAssignmentForm';
import FilterControls from './FilterControls';
import StatsDashboard from './StatsDashboard';
import Status from './Status';
import Controls from './Controls';
import AdminPanel from './AdminPanel'; 

import {
  assignmentReducer,
  initialState,
  ACTIONS,
  getFilteredAssignments,
  getPaginatedAssignments,
  getUniqueSubjects,
} from './assignmentReducer';

function App() {
  const [username, setUsername] = useState('');
  const [loginStatus, setLoginStatus] = useState(LOGIN_STATUS.PENDING);
  const [showRegister, setShowRegister] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [state, dispatch] = useReducer(assignmentReducer, initialState);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const pollingRef = useRef();
  const errorRef = useRef(error);

  useEffect(() => {
    errorRef.current = error;
  }, [error]);

  const handleError = useCallback((err) => {
    const errorKey = err?.error || CLIENT.UNKNOWN_ERROR;
    const message = MESSAGES[errorKey] || MESSAGES.default;
    setError(message);
  }, []);

  function onLogin(username) {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    setError('');
    fetchLogin(username)
      .then(fetchedAssignments => {
        setUsername(username);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        setIsAdmin(username === 'admin');
        dispatch({ type: ACTIONS.SET_ASSIGNMENTS, payload: fetchedAssignments });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        if (username !== 'admin') {
          return fetchStats();
        }
      })
      .then(stats => {
         if (stats) {
           setStats(stats);
         }
      })
      .catch(err => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        handleError(err);
      });
  }

  function onRegister(username) {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    setError('');
    fetchRegister(username)
      .then(fetchedAssignments => {
        setUsername(username);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        setIsAdmin(username === 'admin');
        dispatch({ type: ACTIONS.SET_ASSIGNMENTS, payload: fetchedAssignments });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        if (username !== 'admin') {
          return fetchStats();
        }
      })
       .then(stats => {
         if (stats) {
           setStats(stats);
         }
       })
      .catch(err => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        handleError(err);
      });
  }

  function onLogout() {
    setError('');
    setUsername('');
    setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
    setStats(null);
    setIsAdmin(false);
    dispatch({ type: ACTIONS.RESET });
    clearTimeout(pollingRef.current);
    fetchLogout().catch(handleError);
  }

  function toggleRegisterForm() {
    setShowRegister(!showRegister);
    setError('');
  }

  useEffect(() => {
    fetchSession()
      .then(session => {
        setUsername(session.username);
        setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
        const isAdminUser = session.username === 'admin';
        setIsAdmin(isAdminUser);
        if (!isAdminUser) {
          return Promise.all([
            fetchAssignments(),
            fetchStats(),
          ]);
        } else {
          return Promise.resolve([{}, null]);
        }
      })
      .then(([assignments, stats]) => {
        if (assignments && Object.keys(assignments).length > 0) {
            dispatch({ type: ACTIONS.SET_ASSIGNMENTS, payload: assignments });
        }
        if (stats) {
            setStats(stats);
        }
      })
      .catch(err => {
        if (err?.error === SERVER.AUTH_MISSING) {
          setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
          return;
        }
        handleError(err);
        setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
      });
  }, [handleError]);

  const pollData = useCallback(() => {
    if (loginStatus !== LOGIN_STATUS.IS_LOGGED_IN || isAdmin) return;
    Promise.all([
      fetchAssignments(),
      fetchStats()
    ])
      .then(([assignments, stats]) => {
        if (errorRef.current === MESSAGES[CLIENT.NETWORK_ERROR]) {
          setError('');
        }
        dispatch({ type: ACTIONS.SET_ASSIGNMENTS, payload: assignments });
        setStats(stats);
        clearTimeout(pollingRef.current);
        pollingRef.current = setTimeout(pollData, POLLING_DELAY);
      })
      .catch(err => {
        handleError(err);
        clearTimeout(pollingRef.current);
        pollingRef.current = setTimeout(pollData, POLLING_DELAY);
      });
  }, [dispatch, handleError, MESSAGES, CLIENT, loginStatus, isAdmin]);

  useEffect(() => {
    if (loginStatus === LOGIN_STATUS.IS_LOGGED_IN && !isAdmin) {
      clearTimeout(pollingRef.current);
      pollingRef.current = setTimeout(pollData, POLLING_DELAY);
    } else {
      clearTimeout(pollingRef.current);
    }
    return () => {
      clearTimeout(pollingRef.current);
    };
  }, [loginStatus, isAdmin, pollData]);

  const filteredAssignments = getFilteredAssignments(state);
  const paginatedAssignments = getPaginatedAssignments(
    filteredAssignments,
    state.page,
    state.itemsPerPage
  );
  const totalPages = Math.ceil(filteredAssignments.length / state.itemsPerPage);
  const subjects = getUniqueSubjects(state.assignments);

  return (
    <div className="app">
      <Header
        username={username}
        isLoggedIn={loginStatus === LOGIN_STATUS.IS_LOGGED_IN}
        isAdmin={isAdmin}
      />
      <main className="main">
        {error && <Status error={error} />}

        {loginStatus === LOGIN_STATUS.PENDING && (
          <Loading>Loading user information...</Loading>
        )}

        {loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && !showRegister && (
          <LoginForm
            onLogin={onLogin}
            onSwitchToRegister={toggleRegisterForm}
          />
        )}

        {loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && showRegister && (
          <RegisterForm
            onRegister={onRegister}
            onSwitchToLogin={toggleRegisterForm}
          />
        )}

        {loginStatus === LOGIN_STATUS.IS_LOGGED_IN && (
          <>
            <Controls
              onLogout={onLogout}
              isAdmin={isAdmin} 
            />

            {isAdmin ? (
              <AdminPanel /> 
            ) : (
              <div className="content">
                {stats && <StatsDashboard stats={stats} />}
                <FilterControls
                  filter={state.filter}
                  sort={state.sort}
                  subjects={subjects}
                  onFilterChange={(filter) =>
                    dispatch({ type: ACTIONS.SET_FILTER, payload: filter })
                  }
                  onSortChange={(sort) =>
                    dispatch({ type: ACTIONS.SET_SORT, payload: sort })
                  }
                />
                <AssignmentList
                  assignments={paginatedAssignments}
                  isLoading={state.isLoading}
                  lastAddedId={state.lastAddedId}
                  page={state.page}
                  totalPages={totalPages}
                  onPageChange={(page) =>
                    dispatch({ type: ACTIONS.SET_PAGE, payload: page })
                  }
                  dispatch={dispatch}
                  isAdmin={isAdmin} 
                />
                <AddAssignmentForm dispatch={dispatch} isAdmin={isAdmin} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
