import { combineReducers } from "redux";

import authReducer from "pages/auth/reducer";
import companiesReducer from "pages/companies/reducer";
import staffReducer from "pages/staff/reducer";
import scheduleReducer from "pages/schedule/reducer";
import settingsReducer from "pages/settings/reducer";
import appointmentReducer from "pages/appointments/reducers";
import sharedStoreReducer from "sharedStore/reducer";
import appReducer from "./appReducer";

const rootReducer = combineReducers({
  user: authReducer,
  app: appReducer,
  companies: companiesReducer,
  staff: staffReducer,
  schedule: scheduleReducer,
  settings: settingsReducer,
  appointments: appointmentReducer,
  sharedStore: sharedStoreReducer,
});

export default rootReducer;
