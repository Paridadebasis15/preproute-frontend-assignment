import { createContext, useContext, useMemo, useReducer } from 'react';

const TestContext = createContext(null);
const initialState = { activeTest: null, questions: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TEST': return { ...state, activeTest: action.payload };
    case 'SET_QUESTIONS': return { ...state, questions: action.payload || [] };
    case 'ADD_QUESTION': return { ...state, questions: [...state.questions, action.payload] };
    case 'UPDATE_QUESTION': return { ...state, questions: state.questions.map((q, i) => i === action.payload.index ? action.payload.question : q) };
    case 'DELETE_QUESTION': return { ...state, questions: state.questions.filter((_, i) => i !== action.payload) };
    case 'RESET_TEST_FLOW': return initialState;
    default: return state;
  }
}

export function TestProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ ...state, dispatch }), [state]);
  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
}

export const useTestFlow = () => useContext(TestContext);
