import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Layout from "layouts/layout";
import { BranchMailIcon, PencilIcon } from "assets/images";
import {
  CustomAvatar,
  ProfileCard,
  ProfileCardContent,
  ProfileCardHeader,
} from "shared/components/styles";
import { selectUserInfo } from "store/selectors";
import { setPageTitle, getItemFromLocalStorage } from "utils/helpers";
import { removeSelectedCompany } from "pages/companies/actions";

const UserProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userInfo = useSelector(selectUserInfo);

  const [userData, setUserData] = useState(userInfo);

  useEffect(() => {
    setPageTitle("profile");
  }, []);

  useEffect(() => {
    localStorage.removeItem("companyId");
    dispatch(removeSelectedCompany());
  }, [dispatch]);

  useEffect(() => {
    setUserData(
      Object.entries(userInfo).length
        ? userInfo
        : getItemFromLocalStorage("user"),
    );
  }, [userInfo]);

  const editProfile = () => {
    navigate("/profile/edit");
  };

  return (
    <Layout isProfile title={t("my-profile")}>
      <ProfileCard>
        <ProfileCardHeader>
          <div>
            <span onClick={editProfile}>
              <PencilIcon />
            </span>
          </div>
        </ProfileCardHeader>
        <ProfileCardContent>
          <div className="user-info">
            <CustomAvatar
              size={120}
              icon={<UserOutlined />}
              src={`${userData?.photoUrl}?${new Date()}`}
            />
            <h4 style={{ margin: "30px 0 6px" }}>
              {userData?.firstName} {userData?.lastName}
            </h4>
            <p>{userData?.title}</p>
            <div>
              <BranchMailIcon />
              <p>{userData?.email}</p>
            </div>
          </div>
        </ProfileCardContent>
      </ProfileCard>
    </Layout>
  );
};

export default UserProfile;
