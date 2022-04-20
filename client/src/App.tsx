import React from 'react';
import Container from 'react-bootstrap/Container';
import { Route, Switch } from 'react-router-dom';
import { LoginScreen } from './components';

function App() {
  return (
    <Container className="App" fluid>
      <Switch>
        <Route path='*' component={LoginScreen} />
      </Switch>
    </Container>
  );
}

export default App;
