const defaultState = {
  web3: {},
  accounts: [],
  loading: false,
};

export default function web3Reducer(state = defaultState, action) {
  const { payload } = action;

  switch (action.type) {
    case 'SETTING_WEB3': {
      return { ...state, loading: true }
    }
    case 'SET_WEB3': {
      return { ...state, web3: payload, accounts: action.accounts };
    }
    default: {
      return state;
    }
  }
}
