import { Menu, Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { CaretUpOutlined } from "@ant-design/icons";

import { GlobeWhiteIcon } from "assets/images";
import { setItemsToLocalStorage } from "utils/helpers";
import { languages } from "../enums";
import { LanguageLabel } from "./styles";

const LanguageSwitcher = ({ isCollapsed }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setItemsToLocalStorage({ language: lng });
  };

  const dropdown = (
    <Menu>
      {languages.map(({ label, value }) => (
        <Menu.Item key={label} onClick={() => changeLanguage(label)}>
          <p style={{ margin: 0 }}>{value}</p>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown
      trigger="click"
      overlay={dropdown}
      overlayClassName="custom-dropdown"
    >
      <LanguageLabel>
        <GlobeWhiteIcon style={{ marginBottom: isCollapsed && 20 }} />
        {!isCollapsed && <p>{i18n.language.toUpperCase()}</p>}
        {!isCollapsed && <CaretUpOutlined />}
      </LanguageLabel>
    </Dropdown>
  );
};

export default LanguageSwitcher;
