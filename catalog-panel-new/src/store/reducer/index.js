import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import Common from "./commonReducer";
import estimateReducer from "./estimateReducer";
import globalReducer from "./globalReducer";
import estimateDetailsReducer from "./estimateDetailsReducer";
import QaReducer from "./qaReducer";
//import inspectionReducer from "./inspection";
import inspectionReducer from "./inspectionReducer";
import inspectionDetailsReducer from "./inspectionDetailsReducer";
import workshopQaReducer from "./workshopQaReducer";

export default combineReducers({
  form: formReducer,
  commonReducer: Common,
  estimateReducer,
  globalReducer,
  estimateDetailsReducer,
  inspectionReducer,
  inspectionDetailsReducer,
  qaReducer: QaReducer, // Added
  workshopQaReducer: workshopQaReducer // Added
});
