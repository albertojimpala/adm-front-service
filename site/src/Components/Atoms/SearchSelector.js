import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

export const SearchSelector = ({ children, handleSearch, ...props }) => {
  const handleFilterOption = (input, option) =>
    option.children
      .toString()
      .toLowerCase()
      .indexOf(input.toString().toLowerCase()) >= 0;

  return (
    <Select
      filterOption={handleFilterOption}
      optionFilterProp="children"
      onSearch={handleSearch}
      showSearch
      {...props}
    >
      {children}
    </Select>
  );
};

SearchSelector.propTypes = {
  children: PropTypes.node.isRequired,
  handleSearch: PropTypes.func.isRequired,
};
