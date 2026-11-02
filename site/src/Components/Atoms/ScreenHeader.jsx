import PropTypes from 'prop-types';
import { Flex, Space, Typography } from 'antd';

export const ScreenHeader = ({ title, children }) => (
  <Flex
    align="center"
    justify="space-between"
    wrap
    gap={12}
    className="screen-header"
  >
    <Typography.Title level={3} style={{ margin: 0 }}>
      {title}
    </Typography.Title>
    <Space wrap>{children}</Space>
  </Flex>
);

ScreenHeader.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node,
};
