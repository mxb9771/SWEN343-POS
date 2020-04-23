// external imports:

import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux';

// internal imports:

import { Refund, Sale, Stats, Status } from './pages';
import Reducer from './redux/reducer';

/**
 * Root page responsible for redux initialization and routing
 * 
 * @component
 */
class App extends Component {
  store = createStore(Reducer);

  render() {
    return (
      <Provider store={this.store}>
        <Router>
            <Switch>
                <Route exact path='/' component={Sale} />
                <Route path='/sale' component={Sale} />
                <Route path='/refund' component={Refund} />
                <Route path='/stats' component={Stats} />
                <Route path='/status' component={Status} />
            </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
