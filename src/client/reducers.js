import { combineReducers } from 'redux';
import posts from 'shared/reducers/posts';
import about from 'shared/reducers/abouts';
import home from 'shared/reducers/homes';
import error from 'shared/reducers/errors';

const rootReducer = combineReducers({
  posts,
  about,
  home,
  error,
});

export default rootReducer;

