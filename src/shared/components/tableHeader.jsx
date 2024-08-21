import { SearchOutlined } from "@ant-design/icons";

import { PrimaryButton } from "shared/buttons/styles";
import { SearchInput, StyledTableHeader } from "shared/styles";

const TableHeader = ({ btnText, searchText, handleSearch, openFormModal }) => (
  <StyledTableHeader>
    <SearchInput
      style={{ width: 210 }}
      onChange={handleSearch}
      placeholder={searchText}
      prefix={<SearchOutlined className="search-icon" />}
    />
    <PrimaryButton onClick={openFormModal}>{btnText}</PrimaryButton>
  </StyledTableHeader>
);

export default TableHeader;
