import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";import theme from './theme'
import Load from './Load';

const App = () => {
  return (
    <Switch>
      <Route path='/verysecretsite'>
        <Load demo={false}/>
      </Route>
      <Route path='/'>
        <Load demo={true}/>
      </Route>
    </Switch>
  )
}

export default App;
