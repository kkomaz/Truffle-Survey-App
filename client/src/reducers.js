import { combineReducers } from 'redux';
import web3Reducer from './reducers/web3';
import contractReducer from './reducers/contract';
import surveyReducer from './reducers/survey';


const rootReducer = combineReducers({
  web3: web3Reducer,
  contract: contractReducer,
  survey: surveyReducer,
});

export default rootReducer;
