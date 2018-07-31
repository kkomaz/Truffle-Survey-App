import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import web3Reducer from './reducers/web3';
import contractReducer from './reducers/contract';
import surveyReducer from './reducers/survey';

const rootReducer = combineReducers({
  web3: web3Reducer,
  contract: contractReducer,
  survey: surveyReducer,
  form: formReducer,
});

export default rootReducer;
