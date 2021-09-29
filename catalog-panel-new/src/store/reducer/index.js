import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import Common from "./commonReducer";
import estimateReducer from "./estimateReducer";
import WorkshopManagement from "./workshopReducer";
import loadingReducer from "./loadingReducer";
import estimateDetailsReducer from "./estimateDetailsReducer";
import languageReducer from "./languageReducer";

export default combineReducers({
  form: formReducer,
  commonReducer: Common,
  workshopReducer: WorkshopManagement,
  estimateReducer,
  loadingReducer,
  estimateDetailsReducer,
  languageReducer,
});
