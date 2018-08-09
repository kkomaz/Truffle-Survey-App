import { uniq, includes } from 'lodash-es';
import {
  GET_SURVEYS,
  CREATE_SURVEY,
  GET_SURVEY,
  GET_SURVEY_BALANCE,
  GET_ETH_PRICE,
  SET_ETH_PRICE,
} from '../actions/constants';

const defaultState = {
  ids: [],
};

export default function surveyReducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case GET_SURVEY: {
      const ids = includes(state.ids, action.address) ? state.ids : [...state.ids, action.address];
      return { ...state, [action.address]: payload, ids };
    }
    case GET_SURVEYS: {
      const ids = uniq(payload);
      return { ...state, ids };
    }
    case CREATE_SURVEY: {
      return { ...state, ids: [...state.ids, payload] };
    }
    case GET_SURVEY_BALANCE: {
      return { ...state, [action.address]: { ...state[action.address], balance: payload } };
    }
    case GET_ETH_PRICE:
    case SET_ETH_PRICE: {
      return { ...state, [action.address]: { ...state[action.address], ethPrice: payload } };
    }
    default: {
      return state;
    }
  }
}
