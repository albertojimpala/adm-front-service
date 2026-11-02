import dayjs from 'dayjs';

const oCurrency = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

export const formatMoney = value => oCurrency.format(Number(value) || 0);

export const formatDate = value =>
  value ? dayjs(value).format('DD/MM/YYYY') : '';

export const formatDateTime = value =>
  value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '';

// 2026-01 -> enero 2026
export const formatPeriod = sPeriod =>
  sPeriod ? dayjs(`${sPeriod}-01`).format('MMMM YYYY') : '';

export const currentPeriod = () => dayjs().format('YYYY-MM');

// numero para InputNumber con formato de moneda
export const moneyInputProps = {
  min: 0,
  precision: 2,
  prefix: '$',
  style: { width: '100%' },
};
