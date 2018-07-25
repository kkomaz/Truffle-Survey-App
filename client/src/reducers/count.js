const defaultState = {
  count: 0,
};

export default function countReducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case 'SET_COUNT_VALUE': {
      return { ...state, count: payload };
    }
    default: {
      return state;
    }
  }
}
