import * as types from "./constants";

const initialState = {
  resourceAppointments: [],
  userAppointments: [],
  timeSlots: [],
  stepData: {},
  timeBlockData: {},
  printData: [],
  calendarLoading: false,
  disableButton: false,
  providersSuggestionsList: [],
  userAppointmentsHistory: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.USER_APPOINTMENT_LIST_SUCCESS:
      return {
        ...state,
        userAppointments: payload.appointments,
        resourceAppointments: [],
        userAppointmentsHistory: [],
      };
    case types.ADD_USER_APPOINTMENT_SUCCESS:
      return {
        ...state,
        userAppointments: state.userAppointments.map((appointment) => {
          const { accountId, appointmentsByDay } = appointment;
          if (accountId === payload.accountId) {
            return {
              ...appointment,
              appointmentsByDay: appointmentsByDay.map((data) => {
                if (data.date === payload.date) {
                  return {
                    ...data,
                    appointmentsSteps: [...data.appointmentsSteps, payload],
                  };
                }
                return data;
              }),
            };
          }
          return appointment;
        }),
      };

    case types.UPDATE_USER_DETAILS_SUCCESS:
      return {
        ...state,
        userAppointments: state.userAppointments.map((appointment) => {
          appointment.appointmentsByDay.forEach((data) => {
            data.appointmentsSteps.forEach((step) => {
              if (step.appointmentId === payload.appointmentId) {
                step.userDetails = {
                  phoneNumber: payload.phoneNumber,
                  userName: payload.userName,
                };
              }
            });
          });
          return appointment;
        }),
      };
    case types.DELETE_USER_APPOINTMENT_SUCCESS:
      return {
        ...state,
        userAppointments: state.userAppointments.map((appointment) => {
          if (appointment.accountId === payload.accountId) {
            return {
              ...appointment,
              appointmentsByDay: appointment.appointmentsByDay.map(
                (dayData) => ({
                  ...dayData,
                  appointmentsSteps: dayData.appointmentsSteps.filter(
                    ({ id }) => id !== payload.stepId,
                  ),
                }),
              ),
            };
          }
          return appointment;
        }),
        stepData: {
          ...state.stepData,
          appointmentSteps: state.stepData.appointmentSteps.filter(
            ({ id }) => id !== payload.stepId,
          ),
        },
      };
    case types.RESOURCE_APPOINTMENT_LIST_SUCCESS:
      return {
        ...state,
        resourceAppointments: payload,
        userAppointments: [],
      };
    case types.TIME_SLOTS_SUCCESS:
      return {
        ...state,
        timeSlots: payload,
      };
    case types.APPOINTMENT_BY_ID_SUCCESS:
      return {
        ...state,
        stepData: payload,
      };
    case types.UPDATE_USER_APPOINTMENT_STEP_SUCCESS:
      return {
        ...state,
        userAppointments: state.userAppointments.map((appointment) => {
          if (appointment.accountId === payload.accountId) {
            return {
              ...appointment,
              appointmentsByDay: appointment.appointmentsByDay.map(
                (dayData) => ({
                  ...dayData,
                  appointmentsSteps: dayData.appointmentsSteps.map((step) => {
                    if (step.id === payload.id) {
                      return payload.ticket;
                    }
                    return step;
                  }),
                }),
              ),
            };
          }
          return appointment;
        }),
      };
    case types.ADD_RESOURCE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        resourceAppointments: state.resourceAppointments.map((appointment) => {
          if (appointment.resource.id === payload.resourceId) {
            return {
              ...appointment,
              appointmentsSteps: [...appointment.appointmentsSteps, payload],
            };
          }
          return appointment;
        }),
      };
    case types.UPDATE_RESOURCE_APPOINTMENT_STEP_SUCCESS:
      return {
        ...state,
        resourceAppointments: state.resourceAppointments.map((appointment) => {
          if (appointment.resource.id === payload.ticket.resourceId) {
            return {
              ...appointment,
              appointmentsSteps: appointment.appointmentsSteps.map((step) => {
                if (step.id === payload.ticket.id) {
                  return payload.ticket;
                }
                return step;
              }),
            };
          }
          return appointment;
        }),
      };
    case types.DELETE_RESOURCE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        resourceAppointments: state.resourceAppointments.map((appointment) => {
          if (appointment.resource.id === payload.id) {
            return {
              ...appointment,
              appointmentsSteps: appointment.appointmentsSteps.filter(
                ({ id }) => id !== payload.stepId,
              ),
            };
          }
          return appointment;
        }),
      };
    case types.CALENDAR_PRINT_DATA_SUCCESS:
      return {
        ...state,
        printData: payload,
      };
    case types.CALENDAR_LOADING:
      return {
        ...state,
        calendarLoading: payload,
      };
    case types.DISABLE_BUTTON:
      return {
        ...state,
        disableButton: payload,
      };
    case types.GET_PROVIDERS_SUGGESTIONS_LIST_SUCCESS:
      return {
        ...state,
        providersSuggestionsList: payload,
      };
    case types.SEARCH_USER_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        userAppointments: payload,
        userAppointmentsHistory: payload,
      };
    case types.FILTER_USER_APPOINTMENTS:
      return {
        ...state,
        userAppointments: payload,
      };
    case types.RESET_ADVANCED_SEARCH_VALUES:
      return {
        ...state,
        userAppointmentsHistory: [],
        providersSuggestionsList: [],
      };
    case types.RESET_USER_APPOINTMENTS_LIST:
      return {
        ...state,
        userAppointments: [],
      };
    default:
      return state;
  }
};
