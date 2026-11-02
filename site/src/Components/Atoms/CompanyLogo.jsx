import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import { BankOutlined } from '@ant-design/icons';
import { getFile } from '../../Service/Api';

// logo de la compañia; la imagen se pide con el token porque el endpoint esta protegido
export const CompanyLogo = ({ companyId, size = 40, refreshKey }) => {
  const [sUrl, setUrl] = useState(null);

  useEffect(() => {
    let sObjectUrl;
    let bActive = true;
    getFile(`companies/${companyId}/logo`).then(response => {
      if (bActive && response?.ok) {
        sObjectUrl = URL.createObjectURL(response.data);
        setUrl(sObjectUrl);
      }
    });
    return () => {
      bActive = false;
      if (sObjectUrl) {
        URL.revokeObjectURL(sObjectUrl);
      }
    };
  }, [companyId, refreshKey]);

  return (
    <Avatar
      icon={<BankOutlined />}
      shape="square"
      size={size}
      src={sUrl || undefined}
    />
  );
};

CompanyLogo.propTypes = {
  companyId: PropTypes.string.isRequired,
  size: PropTypes.number,
  refreshKey: PropTypes.number,
};
