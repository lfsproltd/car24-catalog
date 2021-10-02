import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import Common from "./commonReducer";
import estimateReducer from "./estimateReducer";
import WorkshopManagement from "./workshopReducer";
import globalReducer from "./globalReducer";
import estimateDetailsReducer from "./estimateDetailsReducer";
import QaReducer from "./qaReducer";
import inspectionReducer from "./inspection";
import inspectionDetailsReducer from "./inspectionDetailsReducer";

export default combineReducers({
  form: formReducer,
  commonReducer: Common,
  estimateReducer,
  globalReducer,
  estimateDetailsReducer,
  qaReducer: QaReducer, // Added
  inspectionReducer,
  inspectionDetailsReducer,
});
