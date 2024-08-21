import { SearchOutlined } from "@ant-design/icons";

import { PrimaryButton } from "shared/buttons/styles";
import { SearchInput } from "shared/styles";
import { SettingsTableHeader } from "../styles";

const TableHeader = ({
  btnText,
  inputRef,
  searchText,
  handleSearch,
  openFormModal,
}) => (
  <SettingsTableHeader>
    <SearchInput
      ref={inputRef}
      style={{ width: 210 }}
      onChange={handleSearch}
      placeholder={searchText}
      prefix={<SearchOutlined className="search-icon" />}
    />
    <PrimaryButton onClick={openFormModal}>{btnText}</PrimaryButton>
  </SettingsTableHeader>
);

export default TableHeader;
