import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'emotion-theming'
import {  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import theme from './theme'
import Load from './Load';

ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path='/verysecretsite'>
            <Load demo={false}/>
          </Route>
          <Route path='/'>
            <Load demo={true}/>
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>,
  document.getElementById('root')
);
