export const generateQueries = (values, config, prefix) => {
  const aQueries = [];
  let nOrCounter = 0;

  config.forEach(({ name, or, type }) => {
    const aFields = name.split(',');

    aFields.forEach(sField => {
      const oValue = values[name];

      if (oValue === 0 || (oValue && oValue !== '')) {
        if (or) {
          aQueries.push(`$or[${nOrCounter}][${sField}][$iLike]=%${oValue}%`);
          nOrCounter++;
        } else {
          if (type === 'input') {
            const sFieldName = prefix ? `${prefix}[${sField}]` : sField;
            aQueries.push(`${sFieldName}[$iLike]=${oValue}`);
          } else if (type === 'date') {
            const sFieldName = prefix ? `${prefix}[date]` : 'date';
            if (sField.indexOf('_ini') > -1) {
              aQueries.push(
                `${sFieldName}[$gte]=${values[sField].format(
                  'YYYY-MM-DD'
                )} 00:00:00`
              );
            } else if (sField.indexOf('_end') > -1) {
              aQueries.push(
                `${sFieldName}[$lte]=${oValue.format('YYYY-MM-DD')} 23:59:59`
              );
            }
          } else {
            const sFieldName = prefix ? `${prefix}[${sField}]` : sField;
            aQueries.push(`${sFieldName}=${oValue}`);
          }
        }
      }
    });
  });

  return aQueries.join('&');
};
