export const companyAccountType = {
  Owner: 5,
  Admin: 1,
  Manager: 3,
  Operator: 2,
  ServiceProvider: 4,
};

export const companyApprovalState = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
};

export const userInvitationStatuses = {
  Pending: 0,
  Accepted: 1,
  Rejected: 2,
  Expired: 3,
  NotInvited: 4,
};

export const rolesList = [
  { id: 1, label: "admin" },
  { id: 2, label: "operator" },
  { id: 3, label: "manager" },
  { id: 4, label: "service-provider" },
];

export const languages = [
  { label: "ru", value: "Русский" },
  { label: "en", value: "English" },
  { label: "ro", value: "Romanian" },
];

export const initialAdvancedSearchValues = {
  clientName: "",
  phoneNumber: "",
  accountIds: [],
};
