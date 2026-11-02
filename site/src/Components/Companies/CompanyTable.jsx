import { Typography } from 'antd';
import { CrudTable } from '../Atoms/CrudTable';
import { CompanyLogo } from '../Atoms/CompanyLogo';
import { statusColumn } from '../Atoms/StatusTag';
import { CompanyForm, companyToPayload } from '../Forms';
import { STATUS_OPTIONS } from '../../Utils/constants';

const columns = [
  {
    key: 'logo',
    width: 1,
    render: (_, row) => <CompanyLogo companyId={row.id} />,
  },
  {
    dataIndex: 'name',
    title: 'Razón social',
    render: (sName, row) => (
      <>
        <Typography.Text strong>{sName}</Typography.Text>
        {row.tradeName && (
          <>
            <br />
            <Typography.Text type="secondary">{row.tradeName}</Typography.Text>
          </>
        )}
      </>
    ),
  },
  { dataIndex: 'rfc', title: 'RFC' },
  {
    dataIndex: 'receiptPrefix',
    title: 'Folio',
    render: (sPrefix, row) =>
      sPrefix && `${sPrefix}-${String(row.lastReceiptFolio).padStart(6, '0')}`,
  },
  { dataIndex: ['regime', 'description'], title: 'Régimen' },
  { dataIndex: 'email', title: 'Email' },
  { dataIndex: 'phone', title: 'Teléfono' },
  statusColumn,
];

const searchElements = [
  { label: 'Nombre o RFC', name: 'search' },
  { label: 'Estatus', name: 'status', type: 'select', options: STATUS_OPTIONS },
];

export const CompanyTable = () => (
  <CrudTable
    columns={columns}
    entityLabel="compañía"
    FormComponent={CompanyForm}
    model="companies"
    modalWidth={720}
    module="companies"
    searchElements={searchElements}
    title="Compañías"
    toPayload={companyToPayload}
  />
);
