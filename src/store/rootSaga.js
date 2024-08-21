import { all } from "redux-saga/effects";

import authSagaWatcher from "pages/auth/sagas";
import refreshTokenSagaWatcher from "pages/auth/refreshToken/sagas";
import companiesSagaWatcher from "pages/companies/sagas";
import staffSagaWatcher from "pages/staff/sagas";
import scheduleSagaWatcher from "pages/schedule/sagas";
import appointmentRequestWatcher from "pages/appointments/sagas";
import sharedStoreWatcher from "sharedStore/sagas";
import settingsSagaWatcher from "pages/settings/sagas";

export default function* rootSaga() {
  yield all([
    authSagaWatcher(),
    companiesSagaWatcher(),
    staffSagaWatcher(),
    scheduleSagaWatcher(),
    appointmentRequestWatcher(),
    sharedStoreWatcher(),
    refreshTokenSagaWatcher(),
    settingsSagaWatcher(),
  ]);
}
