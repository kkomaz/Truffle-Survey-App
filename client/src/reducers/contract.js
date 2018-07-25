import {
  SET_CONTRACT_INSTANCE,
  SET_SURVEY_FACTORY_CONTRACT_INSTANCE,
} from '../actions/constants';

const defaultState = {
  contract: {},
};

export default function contractReducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case SET_CONTRACT_INSTANCE: {
      return { contract: payload };
    }
    case SET_SURVEY_FACTORY_CONTRACT_INSTANCE: {
      return { ...state, surveyFactoryContract: payload };
    }
    default: {
      return state;
    }
  }
}
