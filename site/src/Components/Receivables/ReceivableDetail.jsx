import PropTypes from 'prop-types';
import { Drawer, Tabs } from 'antd';
import { ClientPendingCharges } from './ClientPendingCharges';
import { ClientStatement } from './ClientStatement';

export const ReceivableDetail = ({ client, onClose, onChanged }) => (
  <Drawer
    destroyOnHidden
    onClose={onClose}
    open={Boolean(client)}
    size={1000}
    title={client?.name}
  >
    {client && (
      <Tabs
        items={[
          {
            key: 'pending',
            label: 'Cargos pendientes',
            children: (
              <ClientPendingCharges
                clientId={client.clientId || client.id}
                onChanged={onChanged}
              />
            ),
          },
          {
            key: 'statement',
            label: 'Estado de cuenta',
            children: (
              <ClientStatement clientId={client.clientId || client.id} />
            ),
          },
        ]}
      />
    )}
  </Drawer>
);

ReceivableDetail.propTypes = {
  client: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onChanged: PropTypes.func,
};
