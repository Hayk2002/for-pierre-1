import * as types from "./constants";

export const getSpecializationServices = () => ({
  type: types.GET_SPEC_SERVICES_REQUEST,
});

export const addSpecialization = (payload, callback) => ({
  type: types.CREATE_SPECIALIZATION_REQUEST,
  payload,
  callback,
});

export const editSpecialization = (id, payload, updatedServices, callback) => ({
  type: types.EDIT_SPECIALIZATION_REQUEST,
  id,
  payload,
  updatedServices,
  callback,
});

export const deleteSpecialization = (id, callback) => ({
  type: types.DELETE_SPECIALIZATION_REQUEST,
  id,
  callback,
});

export const getServices = (payload) => ({
  type: types.GET_SERVICES_REQUEST,
  payload,
});

export const addService = (payload, callback) => ({
  type: types.CREATE_SERVICE_REQUEST,
  payload,
  callback,
});

export const editService = (id, payload, callback) => ({
  type: types.EDIT_SERVICE_REQUEST,
  id,
  payload,
  callback,
});

export const deleteService = (id, callback) => ({
  type: types.DELETE_SERVICE_REQUEST,
  id,
  callback,
});

export const getResources = (payload) => ({
  type: types.GET_RESOURCES_REQUEST,
  payload,
});

export const addResource = (payload, callback) => ({
  type: types.CREATE_RESOURCE_REQUEST,
  payload,
  callback,
});

export const editResource = (id, payload, updatedServices, callback) => ({
  type: types.EDIT_RESOURCE_REQUEST,
  id,
  payload,
  updatedServices,
  callback,
});

export const deleteResource = (id, callback) => ({
  type: types.DELETE_RESOURCE_REQUEST,
  id,
  callback,
});
