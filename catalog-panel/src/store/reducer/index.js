import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import Common from './commonReducer';
import WorkshopManagement from './workshopReducer';

export default combineReducers({
  form: formReducer,
  commonReducer: Common,
  workshopReducer:WorkshopManagement,
});