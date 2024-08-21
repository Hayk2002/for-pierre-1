import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import SideBar from "layouts/sidebar";
import { AuthenticatedViewWrapper } from "shared/styles";
import { ContentWrapper } from "layouts/styles";
import { isUserAuthenticated } from "utils/helpers";

const PrivateRoute = () => {
  const url = useLocation().pathname;
  const isCompleteProfilePage = url.includes("completeProfile");

  const [isCollapsed, setIsCollapsed] = useState(false);

  const minifySidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return isUserAuthenticated() ? (
    <AuthenticatedViewWrapper>
      {!isCompleteProfilePage && (
        <SideBar isCollapsed={isCollapsed} minifySidebar={minifySidebar} />
      )}
      <ContentWrapper
        isCollapsed={isCollapsed}
        isInPublicRoute={isCompleteProfilePage}
      >
        <Outlet />
      </ContentWrapper>
    </AuthenticatedViewWrapper>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
