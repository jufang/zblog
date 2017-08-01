import { combineReducers } from 'redux';
import posts from 'shared/reducers/posts';
import items from 'shared/reducers/items';
import tags from 'shared/reducers/tags';
import about from 'shared/reducers/abouts';
import home from 'shared/reducers/homes';
import error from 'shared/reducers/errors';

const rootReducer = combineReducers({
  posts,
  items,
  tags,
  about,
  home,
  error,
});

export default rootReducer;

