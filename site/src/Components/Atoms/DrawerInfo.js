import React from 'react';
import PropTypes from 'prop-types';
import { Drawer, Typography } from 'antd';
const { Title } = Typography;

export const DrawerInfo = ({
  titulo,
  position,
  onClose,
  open,
  size,
  information,
}) => {
  const Mititulo = () => {
    return (
      <Title level={4} italic>
        {titulo.toUpperCase()}
      </Title>
    );
  };

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
DrawerInfo.propTypes = {
  titulo: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.boolean,
  information: PropTypes.node.isRequired,
};
