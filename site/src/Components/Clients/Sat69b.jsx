import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Modal,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { GET, process } from '../../Service/Api';

// listado del articulo 69-B del CFF (EFOS) que publica el SAT; la API lo descarga y
// lo guarda en memoria. Presunto y definitivo = riesgo alto; los demas ya se aclararon.

const RFC_PATTERN = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;

export const riskText = oEntry =>
  oEntry.risk === 'alto'
    ? `Situación: ${oEntry.status}. El SAT lo señala por operaciones presuntamente inexistentes (EFOS); sus facturas pueden no ser deducibles.`
    : `Situación: ${oEntry.status}. Estuvo en el listado, pero el SAT ya registra que lo aclaró.`;

const errorOf = response =>
  response?.data?.message || 'No se pudo consultar el listado 69-B del SAT';

export const Sat69bResult = ({ result }) => {
  if (result.withoutRfc) {
    return (
      <Alert
        showIcon
        title="El cliente no tiene RFC capturado; no se puede validar."
        type="info"
      />
    );
  }
  const sUpdated = result.listUpdatedAt
    ? ` · listado actualizado al ${result.listUpdatedAt}`
    : '';
  if (!result.found) {
    return (
      <Alert
        description={`RFC ${result.rfc}${sUpdated}`}
        showIcon
        title="No aparece en el listado 69-B"
        type="success"
      />
    );
  }
  return (
    <Alert
      description={
        <>
          <div>{result.found.name}</div>
          <div>{riskText(result.found)}</div>
          <Typography.Text type="secondary">
            RFC {result.rfc}
            {sUpdated}
          </Typography.Text>
        </>
      }
      showIcon
      title={
        result.found.risk === 'alto'
          ? 'Aparece en el listado 69-B'
          : 'Aparece en el listado 69-B (situación aclarada)'
      }
      type={result.found.risk === 'alto' ? 'error' : 'warning'}
    />
  );
};

Sat69bResult.propTypes = { result: PropTypes.object.isRequired };

// boton para revisar un cliente ya registrado
export const Sat69bClientCheck = ({ clientId }) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    setError(null);
    const response = await process(GET, `clients/${clientId}/sat-69b`);
    setLoading(false);
    if (response?.ok) {
      setResult(response.data);
    } else {
      setError(errorOf(response));
    }
  };

  return (
    <Space orientation="vertical" style={{ width: '100%', marginBottom: 12 }}>
      <Button
        icon={<SafetyCertificateOutlined />}
        loading={loading}
        onClick={check}
      >
        {result ? 'Validar de nuevo en 69-B' : 'Validar RFC en el 69-B'}
      </Button>
      {error && <Alert showIcon title={error} type="error" />}
      {result && <Sat69bResult result={result} />}
    </Space>
  );
};

Sat69bClientCheck.propTypes = { clientId: PropTypes.string.isRequired };

// revisa el RFC mientras se captura en el formulario de alta (espera a que se deje de escribir)
export const Sat69bRfcCheck = ({ rfc }) => {
  const sRfc = (rfc || '').trim().toUpperCase();
  const bValid = RFC_PATTERN.test(sRfc);
  const [state, setState] = useState({ rfc: null, result: null, error: null });

  useEffect(() => {
    if (!bValid) {
      return undefined;
    }
    let bActive = true;
    const timer = setTimeout(async () => {
      const response = await process(
        GET,
        'clients/sat-69b/check',
        {},
        {
          queries: { rfc: sRfc },
        },
      );
      if (!bActive) {
        return;
      }
      setState(
        response?.ok
          ? { rfc: sRfc, result: response.data, error: null }
          : { rfc: sRfc, result: null, error: errorOf(response) },
      );
    }, 500);
    return () => {
      bActive = false;
      clearTimeout(timer);
    };
  }, [bValid, sRfc]);

  if (!bValid || state.rfc !== sRfc) {
    return null;
  }
  if (state.error) {
    return (
      <Alert
        showIcon
        style={{ marginBottom: 16 }}
        title={state.error}
        type="warning"
      />
    );
  }
  return (
    <div style={{ marginBottom: 16 }}>
      <Sat69bResult result={state.result} />
    </div>
  );
};

Sat69bRfcCheck.propTypes = { rfc: PropTypes.string };

const reportColumns = [
  { dataIndex: 'name', title: 'Cliente' },
  { dataIndex: 'rfc', title: 'RFC' },
  {
    dataIndex: ['entry', 'status'],
    title: 'Situación en el SAT',
    render: (sStatus, row) => (
      <Tag color={row.entry.risk === 'alto' ? 'red' : 'gold'}>{sStatus}</Tag>
    ),
  },
  {
    dataIndex: ['entry', 'risk'],
    title: 'Riesgo',
    render: sRisk => (sRisk === 'alto' ? 'Alto' : 'Aclarado'),
  },
];

// revisa todos los clientes activos de la compañia
export const Sat69bReportModal = ({ open, onClose }) => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setError(null);
    const response = await process(GET, 'clients/sat-69b/report');
    setLoading(false);
    if (response?.ok) {
      setReport(response.data);
    } else {
      setError(errorOf(response));
    }
  };

  const aMatches = [...(report?.matches || [])].sort((a, b) =>
    a.entry.risk === b.entry.risk
      ? a.name.localeCompare(b.name)
      : a.entry.risk === 'alto'
        ? -1
        : 1,
  );
  const nHigh = aMatches.filter(o => o.entry.risk === 'alto').length;

  return (
    <Modal
      destroyOnHidden
      footer={null}
      onCancel={onClose}
      open={open}
      title="Validar clientes en el listado 69-B del SAT"
      width={820}
    >
      <Typography.Paragraph type="secondary">
        Compara el RFC de todos los clientes activos con el listado de
        contribuyentes del artículo 69-B del CFF (empresas que facturan
        operaciones simuladas).
      </Typography.Paragraph>
      <Button
        icon={<SafetyCertificateOutlined />}
        loading={loading}
        onClick={run}
        style={{ marginBottom: 16 }}
        type="primary"
      >
        {report ? 'Validar de nuevo' : 'Validar todos los clientes'}
      </Button>
      {error && (
        <Alert
          showIcon
          style={{ marginBottom: 16 }}
          title={error}
          type="error"
        />
      )}
      {report && (
        <>
          <Space size="large" style={{ marginBottom: 16 }} wrap>
            <Statistic title="Revisados" value={report.checked} />
            <Statistic title="Sin RFC" value={report.withoutRfc} />
            <Statistic
              title="Riesgo alto"
              value={nHigh}
              styles={{ content: { color: nHigh ? '#cf1322' : undefined } }}
            />
            <Statistic title="Aclarados" value={aMatches.length - nHigh} />
          </Space>
          {report.listUpdatedAt && (
            <Typography.Paragraph type="secondary">
              Listado actualizado al {report.listUpdatedAt}
            </Typography.Paragraph>
          )}
          {aMatches.length ? (
            <Table
              columns={reportColumns}
              dataSource={aMatches}
              pagination={{ pageSize: 10 }}
              rowKey="clientId"
              size="small"
            />
          ) : (
            <Alert
              showIcon
              title="Ningún cliente aparece en el listado 69-B."
              type="success"
            />
          )}
        </>
      )}
    </Modal>
  );
};

Sat69bReportModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
