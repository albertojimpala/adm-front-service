// * Custom DatePicker to use with dayjs instead of momentjs
// * Reference: https://ant.design/docs/react/replace-moment#DatePicker

import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/es/date-picker/generatePicker';
import 'antd/es/date-picker/style/index';

export const DatePicker = generatePicker(dayjsGenerateConfig);
