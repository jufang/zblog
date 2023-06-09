import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App/index';
import PostIndex from './containers/posts/Index/index';
import PostShow from './containers/posts/Show/index';
import AboutShow from './containers/abouts/index';
import HomeShow from './containers/homes/index';
import NotFound from 'shared/containers/NotFound/index';
import Alert from 'shared/containers/Alert/index';
import ProgressBar from 'shared/containers/ProgressBar/index';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={ProgressBar(Alert(HomeShow))} />
    <Route path="/posts" component={ProgressBar(Alert(PostIndex))} />
    <Route path="/posts/:id" component={ProgressBar(Alert(PostShow))} />
    <Route path="/about" component={ProgressBar(Alert(AboutShow))} />
    <Route path="*" component={NotFound} />
    <Route path="/not-found" component={NotFound} />
  </ Route>
);
