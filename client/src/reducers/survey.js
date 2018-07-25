import { GET_SURVEYS } from '../actions/constants';

const defaultState = {
  ids: [],
};

export default function surveyReducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case GET_SURVEYS: {
      return { ...state, ids: payload };
    }
    default: {
      return state;
    }
  }
}
