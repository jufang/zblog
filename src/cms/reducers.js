import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import posts from 'shared/reducers/posts';
import authors from 'shared/reducers/authors';
import auth from 'shared/reducers/auths';
import about from 'shared/reducers/abouts';
import error from 'shared/reducers/errors';

const rootReducer = combineReducers({
  form,
  posts,
  authors,
  auth,
  about,
  error,
});

export default rootReducer;

