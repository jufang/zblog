import 'shared/styles/vendors';
import 'shared/styles/globals';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import useScroll from 'react-router-scroll';
import { createStore, applyMiddleware } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AUTH } from 'shared/constants/actions';
import routes from './routes';
import reducers from './reducers';
import { configureStore } from './store';
import { DevTools} from './devTools';
const store = configureStore();

injectTapEventPlugin();

const accessToken = localStorage.getItem('accessToken');
if (accessToken) {
  store.dispatch({ type: AUTH.SUCCESS });
}
if (process.env.NODE_ENV === 'production') {
  ReactDOM.render(
  <Provider store={store}>
    <Router
      history={browserHistory}
      routes={routes}
      render={applyRouterMiddleware(useScroll())}
    />
  </Provider>
  , document.querySelector('.container'));
}else{
  ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router
        history={browserHistory}
        routes={routes}
        render={applyRouterMiddleware(useScroll())}
      />
      <DevTools/>
    </div>
  </Provider>
  , document.querySelector('.container'));
}

