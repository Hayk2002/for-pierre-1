import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ArrowIcon } from "assets/images";
import { PrimaryButton } from "shared/buttons/styles";
import {
  BackButton,
  LayoutContent,
  LayoutHeader,
  LayoutWrapper,
} from "./styles";

const Layout = ({
  title,
  noMargin,
  children,
  isProfile,
  customUrl,
  hasButton,
  backButtonTitle,
  handleButtonClick,
  contentScrollable,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const returnBack = (url = "/companies/profile") => {
    navigate(url);
  };

  return (
    <LayoutWrapper className={!contentScrollable ? "scrollable" : ""}>
      {backButtonTitle && (
        <BackButton onClick={() => returnBack(customUrl)}>
          <ArrowIcon style={{ transform: "rotate(180deg)" }} />
          <p>{backButtonTitle}</p>
        </BackButton>
      )}
      {title && (
        <LayoutHeader>
          <h4>{title}</h4>
          {hasButton && (
            <PrimaryButton onClick={handleButtonClick}>
              {t("create-company")}
            </PrimaryButton>
          )}
        </LayoutHeader>
      )}
      <LayoutContent
        noMargin={noMargin}
        isProfile={isProfile}
        style={{ height: contentScrollable && "100%" }}
        className={contentScrollable ? "scrollable" : ""}
      >
        {children}
      </LayoutContent>
    </LayoutWrapper>
  );
};

export default Layout;
