import { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  },
  filters: {
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_REPORTS: 'SET_REPORTS',
  SET_CURRENT_REPORT: 'SET_CURRENT_REPORT',
  CLEAR_CURRENT_REPORT: 'CLEAR_CURRENT_REPORT',
  ADD_REPORT: 'ADD_REPORT',
  UPDATE_REPORT: 'UPDATE_REPORT',
  DELETE_REPORT: 'DELETE_REPORT',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS: 'SET_FILTERS',
  RESET_STATE: 'RESET_STATE'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ActionTypes.SET_REPORTS:
      return {
        ...state,
        reports: action.payload.reports || [],
        pagination: action.payload.pagination || state.pagination,
        loading: false,
        error: null
      };

    case ActionTypes.SET_CURRENT_REPORT:
      return {
        ...state,
        currentReport: action.payload,
        loading: false,
        error: null
      };

    case ActionTypes.CLEAR_CURRENT_REPORT:
      return {
        ...state,
        currentReport: null
      };

    case ActionTypes.ADD_REPORT:
      return {
        ...state,
        reports: [action.payload, ...state.reports],
        pagination: {
          ...state.pagination,
          totalCount: state.pagination.totalCount + 1
        }
      };

    case ActionTypes.UPDATE_REPORT:
      return {
        ...state,
        reports: state.reports.map(report =>
          report._id === action.payload._id ? action.payload : report
        ),
        currentReport: state.currentReport?._id === action.payload._id 
          ? action.payload 
          : state.currentReport
      };

    case ActionTypes.DELETE_REPORT:
      return {
        ...state,
        reports: state.reports.filter(report => report._id !== action.payload),
        currentReport: state.currentReport?._id === action.payload 
          ? null 
          : state.currentReport,
        pagination: {
          ...state.pagination,
          totalCount: Math.max(0, state.pagination.totalCount - 1)
        }
      };

    case ActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload
        }
      };

    case ActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case ActionTypes.RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    
    setReports: (data) => dispatch({ 
      type: ActionTypes.SET_REPORTS, 
      payload: data 
    }),
    
    setCurrentReport: (report) => dispatch({ 
      type: ActionTypes.SET_CURRENT_REPORT, 
      payload: report 
    }),
    
    clearCurrentReport: () => dispatch({ type: ActionTypes.CLEAR_CURRENT_REPORT }),
    
    addReport: (report) => dispatch({ 
      type: ActionTypes.ADD_REPORT, 
      payload: report 
    }),
    
    updateReport: (report) => dispatch({ 
      type: ActionTypes.UPDATE_REPORT, 
      payload: report 
    }),
    
    deleteReport: (reportId) => dispatch({ 
      type: ActionTypes.DELETE_REPORT, 
      payload: reportId 
    }),
    
    setPagination: (pagination) => dispatch({ 
      type: ActionTypes.SET_PAGINATION, 
      payload: pagination 
    }),
    
    setFilters: (filters) => dispatch({ 
      type: ActionTypes.SET_FILTERS, 
      payload: filters 
    }),
    
    resetState: () => dispatch({ type: ActionTypes.RESET_STATE })
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
