import { Navigate, Outlet } from "react-router-dom";

import Header from "layouts/header";
import { ContentWrapper } from "layouts/styles";
import { isUserAuthenticated } from "utils/helpers";

const PublicRoute = () =>
  !isUserAuthenticated() ? (
    <>
      <Header />
      <ContentWrapper isInPublicRoute>
        <Outlet />
      </ContentWrapper>
    </>
  ) : (
    <Navigate to="/companies" />
  );

export default PublicRoute;
