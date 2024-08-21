import { lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const LoginPage = lazy(() => import("pages/auth/login"));
const RegisterPage = lazy(() => import("pages/auth/register"));
const InvitationRegisterFlow = lazy(() =>
  import("pages/auth/register/invitationRegisterFlow"),
);
const ForgotPasswordPage = lazy(() => import("pages/auth/forgotPassword"));
const ResetPasswordPage = lazy(() => import("pages/auth/resetPassword"));
const CompleteProfilePage = lazy(() => import("pages/auth/completeProfile"));
const RegistrationVerify = lazy(() =>
  import("pages/auth/register/registrationVerify"),
);
const PrivateRoute = lazy(() => import("./privateRoute"));
const PublicRoute = lazy(() => import("./publicRoute"));
const CompaniesPage = lazy(() => import("pages/companies"));
const CompanyProfilePage = lazy(() => import("pages/companies/companyProfile"));
const BranchesEditPage = lazy(() =>
  import("pages/companies/branches/branchesEditPage"),
);
const CompanyEditPage = lazy(() =>
  import("pages/companies/companyProfile/companyEditPage"),
);
const SettingsPage = lazy(() => import("pages/settings"));
const UserProfile = lazy(() => import("pages/auth/userProfile"));
const ProfileEditPage = lazy(() =>
  import("pages/auth/userProfile/profileEditPage"),
);
const StaffPage = lazy(() => import("pages/staff"));
const AppointmentsPage = lazy(() => import("pages/appointments"));
const SchedulePage = lazy(() => import("pages/schedule"));
const TemplateForm = lazy(() =>
  import("pages/schedule/components/template/templateForm"),
);
const StaffMember = lazy(() => import("pages/staff/components/staffMember"));

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<PublicRoute />}>
        <Route index element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="registration/:email"
          element={<InvitationRegisterFlow />}
        />
        <Route path="forgotPassword" element={<ForgotPasswordPage />} />
        <Route
          path="account/resetPassword/:credentials"
          element={<ResetPasswordPage />}
        />
        <Route
          path="account/verify/:credentials"
          element={<RegistrationVerify />}
        />
      </Route>
      <Route path="/" element={<PrivateRoute />}>
        <Route path="completeProfile" element={<CompleteProfilePage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="companies/profile" element={<CompanyProfilePage />} />
        <Route path="companies/editBranch" element={<BranchesEditPage />} />
        <Route path="companies/profile/edit" element={<CompanyEditPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="schedule/template" element={<TemplateForm />} />
        <Route
          path="schedule/template/:templateId"
          element={<TemplateForm />}
        />
        <Route path="staff" element={<StaffPage />} />
        <Route path="staff/:accountId" element={<StaffMember />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="profile/edit" element={<ProfileEditPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="appointments/:accountId" element={<AppointmentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
