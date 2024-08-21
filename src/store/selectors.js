export const selectUserInfo = (state) => state.user.userInfo;
export const selectIsLoading = (state) => state.app.isFetching;
export const selectError = (state) => state.app.error;
export const selectTimezonesList = (state) => state.companies.timezones;
export const selectCompaniesList = (state) => state.companies.companiesList;
export const selectInvitationsList = (state) => state.companies.invitationsList;
export const selectActiveCompany = (state) => state.companies.selectedCompany;
export const selectActiveBranch = (state) => state.companies.selectedBranch;

export const selectBlockTypes = (state) => state.sharedStore.blockTypes;
export const selectBranchesList = (state) => state.sharedStore.branches;
export const selectTemplateList = (state) => state.sharedStore.templates;
export const selectCalendarLoading = (state) =>
  state.appointments.calendarLoading;
  export const selectDisableButton = (state) =>
  state.appointments.disableButton;
export const selectAppointmentsList = (state) =>
  state.appointments.userAppointments;
export const selectResourceAppointmentsList = (state) =>
  state.appointments.resourceAppointments;
export const selectUserAppointmentsHistory = (state) =>
  state.appointments.userAppointmentsHistory;
export const selectSpecializationsList = (state) =>
  state.sharedStore.specializations;
export const selectCoreSpecializationsList = (state) =>
  state.settings.specializations;
export const selectStepData = (state) => state.appointments.stepData;
export const selectTimeSlotes = (state) => state.appointments.timeSlots;
export const selectTimeBlockData = (state) => state.appointments.timeBlockData;
export const selectPrintData = (state) => state.appointments.printData;
export const selectProvidersSuggestionsList = (state) =>
  state.appointments.providersSuggestionsList;

export const selectSpecializationsPagination = (state) =>
  state.settings.specializationsPagination;
export const selectSpecializationServices = (state) =>
  state.settings.specializationsServices;
export const selectServicesList = (state) => state.settings.services;
export const selectServicesPagination = (state) =>
  state.settings.servicesPagination;
export const selectResourcesList = (state) => state.settings.resources;
export const selectResourcesPagination = (state) =>
  state.settings.resourcesPagination;
export const selectTemplatesPagination = (state) =>
  state.schedule.templatesPagination;
export const selectCompanyAccountsList = (state) => state.staff.staffList;
export const selectCompanyInvitationsList = (state) => state.staff.invitations;
export const selectStaffMemberData = (state) => state.staff.staffMember;
export const selectStaffMemberBranches = (state) =>
  state.staff.staffMemberBranches;
export const selectStaffMemberSpecializations = (state) =>
  state.staff.staffMemberSpecializations;
export const selectBranchSpecializations = (state) =>
  state.staff.branchSpecializations;
export const selectTimeBlocksList = (state) => state.sharedStore.timeBlocks;
export const selectCustomScheduleTemplate = (state) =>
  state.staff.customScheduleTemplate;
export const selectCustomDayScheduleTemplate = (state) =>
  state.staff.customDayScheduleTemplate;
// export const selectAccountSchedule = (state) =>
//   state.schedule.accountScheduleData;
export const selectWeeklyScheduleTemplate = (state) =>
  state.staff.weeklyScheduleTemplate;
export const selectScheduleList = (state) => state.schedule.scheduleList;
export const selectTemplate = (state) => state.schedule.template;
export const selectSchedulePageActiveTab = (state) => state.schedule.activeTab;
export const selectServiceProvider = (state) =>
  state.sharedStore.serviceProvider;
