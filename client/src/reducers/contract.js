import { SET_CONTRACT_INSTANCE } from '../actions/constants';

const defaultState = {
  contract: {},
};

export default function contractReducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case SET_CONTRACT_INSTANCE: {
      return {
        contract: payload,
      };
    }
    default: {
      return state;
    }
  }
}
