import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";

import {
  CompanyImageUploadActions,
  CustomAvatar,
  UploadViewContainer,
  UserImageUploadActions,
} from "./styles";
import { UploadButton } from "../buttons/styles";

const ImageUploadView = ({
  imageUrl,
  isProfile,
  uploadImage,
  isInStepFlow,
  isCompleteProfile,
  removeProfileImage,
  removeCompanyImage,
}) => {
  const { t } = useTranslation();

  const isButtonVisible =
    !isInStepFlow &&
    !isCompleteProfile &&
    !imageUrl?.includes("null") &&
    !imageUrl?.includes("undefined");

  return (
    <UploadViewContainer isProfile={isProfile}>
      {isProfile ? (
        <>
          <CustomAvatar size={100} src={imageUrl} icon={<UserOutlined />} />
          <UserImageUploadActions>
            <label htmlFor="upload">{t("change-image")}</label>
            {isButtonVisible && (
              <button onClick={removeProfileImage} type="button">
                {t("remove-image")}
              </button>
            )}
          </UserImageUploadActions>
        </>
      ) : (
        <>
          <CustomAvatar
            $isSquare
            size={90}
            shape="square"
            src={imageUrl}
            icon={<UserOutlined />}
          />
          <CompanyImageUploadActions>
            <UploadButton htmlFor="upload" style={{ padding: "0 5px" }}>
              {isCompleteProfile ? t("upload-image") : t("upload-logo")}
            </UploadButton>
            {isButtonVisible && (
              <button onClick={removeCompanyImage} type="button">
                {t("remove-image")}
              </button>
            )}
          </CompanyImageUploadActions>
        </>
      )}
      <input
        id="upload"
        type="file"
        onChange={uploadImage}
        accept="image/jpeg, image/jpg, image/png"
      />
    </UploadViewContainer>
  );
};

export default ImageUploadView;
