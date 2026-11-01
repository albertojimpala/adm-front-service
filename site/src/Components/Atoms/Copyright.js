import React from 'react';
import { Link, Typography } from '@mui/material';

export const Copyright = props => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="http://www.haylex.mx">
        HAYLEX Consultoria Legal y Contable
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};
