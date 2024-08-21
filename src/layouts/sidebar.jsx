import { Menu, Dropdown } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined, CaretDownOutlined } from "@ant-design/icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { Minify, Expand } from "assets/images";
import { logoutUser, setUserDataObject } from "pages/auth/actions";
import {
  selectActiveCompany,
  selectCompaniesList,
  selectUserInfo,
} from "store/selectors";
import { getCompaniesList, setSelectedCompany } from "pages/companies/actions";
import { getItemFromLocalStorage, setItemsToLocalStorage } from "utils/helpers";
import { CustomAvatar } from "shared/components/styles";
import { getBranchesList } from "sharedStore/actions";
import {
  CustomSidebar,
  CustomSidebarContent,
  CustomSidebarFooter,
  CustomSidebarHeader,
} from "./styles";
import LanguageSwitcher from "../shared/components/languageSwitcher";

const defaultLanguage = localStorage.getItem("i18nextLng");
const selectedLanguage = getItemFromLocalStorage("language");

const SideBar = ({ isCollapsed, minifySidebar }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const userInfo = useSelector(selectUserInfo);
  const companies = useSelector(selectCompaniesList);
  const activeCompany = useSelector(selectActiveCompany);

  const [userData, setUserData] = useState(userInfo);
  const [dropdownView, setDropdownView] = useState(false);

  useEffect(() => {
    if (userInfo !== null) {
      setUserData(
        Object.entries(userInfo).length
          ? userInfo
          : getItemFromLocalStorage("user"),
      );
    }
  }, [userInfo]);

  useEffect(() => {
    dispatch(getCompaniesList());
    if (selectedLanguage === null) {
      setItemsToLocalStorage({ language: defaultLanguage });
    }
    dispatch(setUserDataObject(getItemFromLocalStorage("user")));
  }, [dispatch]);

  useEffect(() => {
    if (selectedLanguage !== null) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [i18n]);

  const toggleDropdown = () => {
    setDropdownView(!dropdownView);
  };

  const handleLogout = () => {
    dispatch(
      logoutUser(() => {
        window.location.reload();
        i18n.changeLanguage("en");
      }),
    );
  };

  const handleOnCompanyCLick = (company) => {
    setItemsToLocalStorage({ companyId: company.id });
    dispatch(setSelectedCompany(company));
    navigate("/companies/profile");
    dispatch(getBranchesList());
  };

  const userDropdownFields = [
    {
      navLink: "/companies",
      icon: "icon-dashboard",
      text: t("my-companies"),
    },
    {
      navLink: "/profile",
      icon: "icon-profile",
      text: t("my-profile"),
    },
  ];

  const companyMenuFields = [
    {
      navLink: `/companies/profile`,
      icon: "icon-company",
      text: t("company"),
    },
    {
      navLink: "/staff",
      icon: "icon-staff",
      text: t("staff"),
    },
    {
      navLink: "/schedule",
      icon: "icon-schedule",
      text: t("schedule"),
    },
    {
      navLink: "/appointments",
      icon: "icon-appointment",
      text: t("appointments"),
    },
    {
      navLink: "/settings",
      icon: "icon-setting",
      text: t("settings"),
    },
  ];

  const serviceProviderFields = [
    {
      navLink: `/companies/profile`,
      icon: "icon-company",
      text: t("company"),
    },
    {
      navLink: "/schedule",
      icon: "icon-schedule",
      text: t("schedule"),
    },
    {
      navLink: "/appointments",
      icon: "icon-appointment",
      text: t("appointments"),
    },
  ];

  const operatorFields = [
    {
      navLink: `/companies/profile`,
      icon: "icon-company",
      text: t("company"),
    },
    {
      navLink: "/appointments",
      icon: "icon-appointment",
      text: t("appointments"),
    },
  ];

  const userDropdown = (
    <Menu>
      {userDropdownFields.map((field) => (
        <Menu.Item key={field.navLink}>
          <span className={`icon ${field.icon}`} />
          <NavLink to={field.navLink}>{field.text}</NavLink>
        </Menu.Item>
      ))}
      <Menu.Item key="3" onClick={handleLogout}>
        <span className="icon icon-logout" />
        {t("log-out")}
      </Menu.Item>
    </Menu>
  );

  const companyDropdown = (
    <Menu className="scrollable scrollable_sm" style={{ maxHeight: 300 }}>
      {companies?.map(
        (company) =>
          company.status === 1 &&
          company.hasBranches && (
            <Menu.Item
              key={company.id}
              onClick={() => handleOnCompanyCLick(company)}
            >
              <CustomAvatar
                size={22}
                icon={<UserOutlined />}
                style={{ marginRight: "5px" }}
                src={`${company?.photoUrl}?${new Date()}`}
              />
              <p style={{ margin: 0 }}>{company.name}</p>
            </Menu.Item>
          ),
      )}
    </Menu>
  );

  const renderCompanySpecificRoutes = () => {
    let companyRoutes = [];

    if (
      activeCompany?.accountTypeId === 1 ||
      activeCompany?.accountTypeId === 5
    ) {
      companyRoutes = companyMenuFields;
    } else if (
      activeCompany?.accountTypeId === 3 ||
      activeCompany?.accountTypeId === 4
    ) {
      companyRoutes = serviceProviderFields;
    } else {
      companyRoutes = operatorFields;
    }

    return (
      activeCompany && (
        <Menu activeKey={pathname} selectedKeys={pathname}>
          {companyRoutes.map((field) => (
            <Menu.Item
              key={field.navLink}
              onClick={() => navigate(field.navLink)}
            >
              <span className={`icon ${field.icon}`} />
              <p>{!isCollapsed && field.text}</p>
            </Menu.Item>
          ))}
        </Menu>
      )
    );
  };

  return (
    <CustomSidebar className="scrollable" collapsed={isCollapsed}>
      <Dropdown
        trigger="click"
        overlay={userDropdown}
        overlayClassName="custom-dropdown"
      >
        <CustomSidebarHeader
          company={false}
          onClick={toggleDropdown}
          collapsed={isCollapsed}
        >
          <CustomAvatar
            size={36}
            icon={<UserOutlined />}
            src={`${userData?.photoUrl}?${new Date()}`}
          />
          {!isCollapsed && (
            <p className="truncated-text">{userData?.firstName}</p>
          )}
          {!isCollapsed && <CaretDownOutlined />}
        </CustomSidebarHeader>
      </Dropdown>
      {activeCompany?.hasBranches && (
        <Dropdown
          overlay={companyDropdown}
          trigger="click"
          overlayClassName="custom-dropdown"
        >
          <CustomSidebarHeader
            onClick={toggleDropdown}
            collapsed={isCollapsed}
            company
          >
            <CustomAvatar
              size={60}
              $isSquare
              icon={<UserOutlined />}
              src={`${activeCompany?.photoUrl}?${new Date()}`}
            />
            {!isCollapsed && (
              <p className="truncated-text" style={{ maxWidth: 240 }}>
                {activeCompany?.name}
              </p>
            )}
          </CustomSidebarHeader>
        </Dropdown>
      )}
      <CustomSidebarContent>
        {activeCompany?.hasBranches && renderCompanySpecificRoutes()}
      </CustomSidebarContent>
      <CustomSidebarFooter collapsed={isCollapsed}>
        <LanguageSwitcher isCollapsed={isCollapsed} />
        <span onClick={minifySidebar}>
          {!isCollapsed ? <Minify /> : <Expand />}
        </span>
      </CustomSidebarFooter>
    </CustomSidebar>
  );
};

export default SideBar;
