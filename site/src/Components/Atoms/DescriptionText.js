import React from 'react';
import PropTypes from 'prop-types';
import { Drawer, Typography } from 'antd';
const { Title } = Typography;

export const DescriptionText = ({
  titulo,
  text
}) => {
  return (
    <Drawer
      title={<Mititulo />}
      placement={position}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      size={size}
      headerStyle={{ textAlign: 'center' }}
    >
      {information}
    </Drawer>
  );
};
DescriptionText.propTypes = {
  titulo: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
