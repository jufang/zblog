import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import { DevTools} from './redux/DevTools';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './App';

// If we ever wanted to do server-side rendering, the intial state would get passed to the front end by passing
// the server-side store to the "__INITIAL_STATE__" client-side global variable via a script tag and "hydrating"
// our client-side state with it here
// const store = configureStore(window.__INITIAL_STATE__ || { user: null, posts: []});
const store = configureStore();
if (process.env.NODE_ENV === 'production') {

  render((
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App} />
      </Router>
    </Provider>
  ), document.getElementById('root'));

} else {
  render((
    <Provider store={store}>
      <div>
        <Router history={browserHistory}>
          <Route path="/" component={App} />
        </Router>
        <DevTools />
      </div>
    </Provider>
  ), document.getElementById('root'));

}
