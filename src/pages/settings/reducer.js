import * as types from "./constants";

const initialState = {
  specializations: [],
  specializationsServices: [],
  services: [],
  resources: [],
  specializationsPagination: {},
  servicesPagination: {},
  resourcesPagination: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.GET_SPECIALIZATIONS_SUCCESS:
      return { ...state, specializations: payload };
    case types.GET_SPECIALIZATION_PAGINATION:
      return { ...state, specializationsPagination: payload };
    case types.GET_SPEC_SERVICES_SUCCESS:
      return { ...state, specializationsServices: payload };
    case types.CREATE_SPECIALIZATION_SUCCESS:
      return {
        ...state,
        specializations: [...state.specializations, { ...payload }],
      };
    case types.EDIT_SPECIALIZATION_SUCCESS:
      return {
        ...state,
        specializations: state.specializations.map((item) => {
          if (item.id === payload.id) {
            return {
              ...item,
              name: payload.name,
              description: payload.description,
              services: payload.services,
            };
          }
          return item;
        }),
      };
    case types.DELETE_SPECIALIZATION_SUCCESS:
      return {
        ...state,
        specializations: state.specializations.filter(
          (item) => item.id !== payload.id,
        ),
      };
    case types.GET_SERVICES_SUCCESS:
      return { ...state, services: payload };
    case types.GET_SERVICE_PAGINATION:
      return { ...state, servicesPagination: payload };
    case types.CREATE_SERVICE_SUCCESS:
      return {
        ...state,
        services: [...state.services, { ...payload }],
      };
    case types.EDIT_SERVICE_SUCCESS:
      return {
        ...state,
        services: state.services.map((service) => {
          if (service.id === payload.id) {
            return {
              ...service,
              name: payload.name,
              color: payload.color,
              duration: payload.duration,
              description: payload.description,
            };
          }
          return service;
        }),
      };
    case types.DELETE_SERVICE_SUCCESS:
      return {
        ...state,
        services: state.services.filter((service) => service.id !== payload.id),
      };
    case types.GET_RESOURCES_SUCCESS:
      return { ...state, resources: payload };
    case types.GET_RESOURCE_PAGINATION:
      return { ...state, resourcesPagination: payload };
    case types.CREATE_RESOURCE_SUCCESS:
      return {
        ...state,
        resources: [...state.resources, { ...payload }],
      };
    case types.EDIT_RESOURCE_SUCCESS:
      return {
        ...state,
        resources: state.resources.map((item) => {
          if (item.id === payload.id) {
            return {
              ...item,
              name: payload.name,
              description: payload.description,
              services: payload.services,
            };
          }
          return item;
        }),
      };
    case types.DELETE_RESOURCE_SUCCESS:
      return {
        ...state,
        resources: payload,
      };
    default:
      return state;
  }
};
