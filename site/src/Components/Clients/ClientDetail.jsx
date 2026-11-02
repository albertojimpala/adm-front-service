import PropTypes from 'prop-types';
import { Drawer, Tabs } from 'antd';
import { usePermissions } from '../../Hooks';
import { ClientPendingCharges } from '../Receivables/ClientPendingCharges';
import { ClientStatement } from '../Receivables/ClientStatement';
import { ClientGeneral } from './ClientGeneral';
import { ClientJobs } from '../Jobs/ClientJobs';
import { ClientCredentials } from './ClientCredentials';

export const ClientDetail = ({ client, onClose, onChanged }) => {
  const { can } = usePermissions();

  return (
    <Drawer
      destroyOnHidden
      onClose={onClose}
      open={Boolean(client)}
      size="min(1000px, 100vw)"
      title={client?.name}
    >
      {client && (
        <Tabs
          items={[
            {
              key: 'general',
              label: 'Datos y servicios',
              children: (
                <ClientGeneral clientId={client.id} onChanged={onChanged} />
              ),
            },
            ...(can('credentials', 'read')
              ? [
                  {
                    key: 'credentials',
                    label: 'Cuentas de acceso',
                    children: <ClientCredentials clientId={client.id} />,
                  },
                ]
              : []),
            ...(can('jobs', 'read')
              ? [
                  {
                    key: 'jobs',
                    label: 'Trabajos',
                    children: <ClientJobs clientId={client.id} />,
                  },
                ]
              : []),
            ...(can('receivables', 'read')
              ? [
                  {
                    key: 'pending',
                    label: 'Adeudo',
                    children: <ClientPendingCharges clientId={client.id} />,
                  },
                  {
                    key: 'statement',
                    label: 'Estado de cuenta',
                    children: <ClientStatement clientId={client.id} />,
                  },
                ]
              : []),
          ]}
        />
      )}
    </Drawer>
  );
};

ClientDetail.propTypes = {
  client: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onChanged: PropTypes.func,
};
