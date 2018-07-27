import { GET_SURVEYS, CREATE_SURVEY } from '../actions/constants';

const defaultState = {
  ids: [],
};

export default function surveyReducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case GET_SURVEYS: {
      return { ...state, ids: payload };
    }
    case CREATE_SURVEY: {
      return { ...state, ids: [...state.ids, payload] };
    }
    default: {
      return state;
    }
  }
}
