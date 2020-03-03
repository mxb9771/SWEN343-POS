import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux';

import Login from './pages/login';
import Sale from './pages/sale';
import Reducer from './redux/reducer';


class App extends Component {
  store = createStore(Reducer);

  render() {
    return (
      <Provider store={this.store}>
        <Router>
            <Switch>
                <Route exact path='/' component={Login} />
                <Route path='/sale' component={Sale} />
                <Route path='/login' component={Login} />
            </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
