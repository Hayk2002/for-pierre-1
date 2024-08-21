import * as signalR from "@microsoft/signalr";
import { SITE_URL as baseUrl } from "api/endpoints";

import { GET_BRANCHES_REQUEST } from "sharedStore/constants";
import store from "../configureStore";

const onNotificationReceived = (dispatch, data) => {
  const { AccountId, ServiceProviderName, StartTime, EndTime, Duration } = data;
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  const options = {
    body: "This is the body of the Notification",
    icon: "https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?    auto=compress&cs=tinysrgb&dpr=1&w=500",
    dir: "ltr",
  };
  // eslint-disable-next-line no-new
  new Notification("Notification Demo", options);
};

const createConnection = (id) =>
  new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/appointmentHub?ids=${id}`)
    .withAutomaticReconnect()
    .build();

const startSignalRConnection = async (connection, dispatch) => {
  try {
    await connection.start();
    connection.on(
      "ReceiveNotification",
      (AccountId, ServiceProviderName, StartTime, EndTime, Duration) => {
        onNotificationReceived(dispatch, {
          AccountId,
          ServiceProviderName,
          StartTime,
          EndTime,
          Duration,
        });
      },
    );

    connection.on(
      "ReceiveGroupNotification",
      (AccountId, ServiceProviderName, StartTime, EndTime, Duration) => {
        onNotificationReceived(dispatch, {
          AccountId,
          ServiceProviderName,
          StartTime,
          EndTime,
          Duration,
        });
      },
    );
  } catch (err) {
    setTimeout(() => startSignalRConnection(connection, dispatch), 5000);
  }
};

const appointmentNotificationMiddleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (action.type === GET_BRANCHES_REQUEST) {
      const userData = store.getState().user;
      startSignalRConnection(createConnection(userData.id), dispatch);
    }
    return next(action);
  };

export default appointmentNotificationMiddleware;
