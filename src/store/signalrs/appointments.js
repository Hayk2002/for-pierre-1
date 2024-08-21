import * as signalR from "@microsoft/signalr";
import store from "store/configureStore";

import { SITE_URL as baseUrl } from "api/endpoints";
import {
  APPOINTMENT_LIST_SIGNALR_START,
  APPOINTMENT_LIST_SIGNALR_CLOSE,
  ADD_USER_APPOINTMENT_SUCCESS,
  DELETE_USER_APPOINTMENT_SUCCESS,
  UPDATE_USER_APPOINTMENT_STEP_SUCCESS,
  ADD_RESOURCE_APPOINTMENT_SUCCESS,
  UPDATE_RESOURCE_APPOINTMENT_STEP_SUCCESS,
  DELETE_RESOURCE_APPOINTMENT_SUCCESS,
} from "pages/appointments/constants";

let connection = null;
let isConnected = false;
let prevIds = "";
let prevPage = null;
let prevBranchId = null;

const appointmentMiddleware = () => (next) => (action) => {
  const { dispatch } = store;
  if (action.type === APPOINTMENT_LIST_SIGNALR_START) {
    const { appointments, branchId: selectedBranchId, page } = action.payload;
    let ids = appointments.map(
      ({ accountId, resource }) => accountId ?? resource?.id ?? null,
    );

    if (ids.length) {
      ids = ids.join(".");
    } else {
      return next(action);
    }

    if (!isConnected) {
      connection = new signalR.HubConnectionBuilder()
        .withUrl(
          `${baseUrl}/appointmentHub?page=${page}&branchId=${selectedBranchId}&ids=${ids}`,
        )
        .withAutomaticReconnect()
        .build();
      isConnected = true;

      prevIds = ids;
      prevPage = page;
      prevBranchId = selectedBranchId;

      connection
        .start()
        .then(() => {
          connection.on(
            "ReceiveUserAppointmentSteps",
            (appointmentStep, branchId) => {
              if (branchId === prevBranchId) {
                dispatch({
                  type: ADD_USER_APPOINTMENT_SUCCESS,
                  payload: appointmentStep,
                });
              }
            },
          );

          connection.on(
            "RemoveUserAppointmentSteps",
            (id, branchId, stepId) => {
              if (branchId === prevBranchId) {
                dispatch({
                  type: DELETE_USER_APPOINTMENT_SUCCESS,
                  payload: { accountId: id, stepId },
                });
              }
            },
          );

          connection.on(
            "ReceiveResourceAppointmentSteps",
            (appointmentStep, branchId) => {
              if (branchId === prevBranchId) {
                dispatch({
                  type: ADD_RESOURCE_APPOINTMENT_SUCCESS,
                  payload: appointmentStep,
                });
              }
            },
          );

          connection.on(
            "RemoveResourceAppointmentSteps",
            (id, branchId, stepId) => {
              if (branchId === prevBranchId) {
                dispatch({
                  type: DELETE_RESOURCE_APPOINTMENT_SUCCESS,
                  payload: { id, stepId },
                });
              }
            },
          );
          connection.on(
            "UpdateUserAppointmentSteps",
            (accountId, branchId, id, ticket) => {
              if (branchId === prevBranchId) {
                dispatch({
                  type: UPDATE_USER_APPOINTMENT_STEP_SUCCESS,
                  payload: { accountId, id, ticket },
                });
              }
            },
          );
          connection.on(
            "UpdateResourceAppointmentSteps",
            (accountId, branchId, id, ticket) => {
              if (branchId === prevBranchId) {
                dispatch({
                  type: UPDATE_RESOURCE_APPOINTMENT_STEP_SUCCESS,
                  payload: { ticket },
                });
              }
            },
          );
        })
        .catch((e) => console.log("Connection failed: ", e));
    } else if (
      ids !== prevIds ||
      prevPage !== page ||
      prevBranchId !== selectedBranchId
    ) {
      prevIds = ids;
      prevPage = page;
      prevBranchId = selectedBranchId;

      connection
        .invoke("Resubscribe", page, String(selectedBranchId), ids)
        .catch((e) => console.log("Resubscribe error:", e));
    }
  } else if (action.type === APPOINTMENT_LIST_SIGNALR_CLOSE) {
    connection?.stop();
    connection = null;
    isConnected = false;
  }

  return next(action);
};

export default appointmentMiddleware;
