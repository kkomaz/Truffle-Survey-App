import { combineReducers } from 'redux';
import countReducer from './reducers/count';
import web3Reducer from './reducers/web3';
import contractReducer from './reducers/contract';
import surveyReducer from './reducers/survey';


const rootReducer = combineReducers({
  count: countReducer,
  web3: web3Reducer,
  contract: contractReducer,
  survey: surveyReducer,
});

export default rootReducer;
