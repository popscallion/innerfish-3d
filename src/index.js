import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'
import theme from './theme'
import Load from './Load';


ReactDOM.render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Load />
      </ThemeProvider>
    </BrowserRouter>,
  document.getElementById('root')
);
