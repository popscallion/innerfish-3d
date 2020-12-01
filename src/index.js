import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'emotion-theming'
import theme from './theme'
import Load from './Load';


ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Load />
    </ThemeProvider>,
  document.getElementById('root')
);
