import { 
  //post
  FETCH_POSTS,
  FETCH_POSTS_INFINITELY,
  FETCH_POST,
  FETCH_EDIT_POST,
  FETCH_NEW_POST, 
  SAVE_POST,
  TOGGLE_POST ,
  RESET_POST,
  //tag
  FETCH_TAGS,
  FETCH_TAGS_FORM,
  CREATE_TAG,
  DELETE_TAG,
  //item
  FETCH_ITEMS,
  CREATE_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM,
  MOVE_ITEM_TOP,
  MOVE_ITEM_UP,
  MOVE_ITEM_DOWN,
  MOVE_ITEM_BOTTOM,
} from 'shared/constants/actions';

const INITIAL_STATE = { 
  //所有文章列表数据
  posts: [],
  loading: false,
  limit: 20, 
  page: 1, 
  total: 0,
  //单个文章数据
  post: { 
    title: '',
    publishedAt: null,
    items:[],
    tags:[]
  },
  //单个表单数据
  postForm: { },
  items: [],
  tags: [],
  tagSuggestions: [],
  errorMessage: ''
  
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_POSTS_INFINITELY.REQUEST:
      return { ...state, loading: true };

    case FETCH_POSTS_INFINITELY.SUCCESS:
      let posts;
      // initiate posts in the first loading, after the second loading, add posts to the previously loaded posts
      if(action.payload.page === 1) {
        posts = [...action.payload.posts]
      } else {
        posts = [...state.posts, ...action.payload.posts]
      }

      return {
        ...state,
        posts,
        loading: false,
        limit: action.payload.limit,
        page: action.payload.page,
        total: action.payload.total
      };
    
    case FETCH_POSTS.SUCCESS:
      return {
        ...state,
        posts: action.payload.posts,
        limit: action.payload.limit,
        page: action.payload.page,
        total: action.payload.total
      };
    
    case RESET_POST:
      return { ...state, post: {}, errorMessage: '' };

    case FETCH_POST.SUCCESS:
      return {...state, post: action.payload.post, errorMessage: '' };

    case FETCH_EDIT_POST.SUCCESS:
      return { ...state, 
        postForm: action.payload.postForm,
        items:action.payload.items,
        tags:action.payload.tags,
        tagSuggestions:action.payload.tagSuggestions,
        errorMessage: '' 
      };
    
    case FETCH_NEW_POST.SUCCESS:
      return { ...state,
        post: {},
        postForm: {},
        items:[],
        tags:[],
        tagSuggestions:action.payload.tagSuggestions
      };
      
    case SAVE_POST.SUCCESS:
      return { ...state, postForm: {}, errorMessage: '' };
    
    case TOGGLE_POST.SUCCESS:
      const tempPost = { 
        ...state.posts[action.payload.sortRank], 
        accepted: action.payload.accepted, 
        status: action.payload.status 
      };
      const tempPosts = [...state.posts.slice(0, action.payload.sortRank), tempPost, ...state.posts.slice(action.payload.sortRank + 1)];
      return { ...state, posts: tempPosts };

    case FETCH_POSTS_INFINITELY.FAILURE:
      return { ...state, loading: false };

    case SAVE_POST.FAILURE:
      return { ...state, errorMessage: action.payload.errorMessage };
    //tag数据更新区域
    case FETCH_TAGS:
      return {...state, tags: action.payload.tags };

    case FETCH_TAGS_FORM:
      return { ...state, tags: action.payload.tags, tagSuggestions: action.payload.tagSuggestions };

    case CREATE_TAG:
      return { ...state, tags: [...state.tags, action.payload.tag] };
    
    case DELETE_TAG:
      if(state.tags){
        const tags = [...state.tags.slice(0, action.payload.sortRank), ...state.tags.slice(action.payload.sortRank + 1)];
        return { ...state, tags };
      }
    
    //item数据更新区
    case FETCH_ITEMS:
      return { ...state, items: action.payload.items};

    case CREATE_ITEM:
      return {...state, items:[...state.items,action.payload.item ]};

    case UPDATE_ITEM:
      return {
        ...state,
        items:[
          ...state.items.slice(0, action.payload.sortRank),
          action.payload.item,
          ...state.items.slice(action.payload.sortRank + 1),
        ]
      };

    case DELETE_ITEM:
      return  {
        ...state,
        items:[
          ...state.items.slice(0, action.payload.sortRank),
          ...state.items.slice(action.payload.sortRank + 1),
        ]
      };

    case MOVE_ITEM_TOP:
      if (state.items.length > 0 && action.payload.sortRank !== 0) {
        const topItem = state.items.slice(action.payload.sortRank, action.payload.sortRank + 1);
        return {
           ...state,
          items:[
            ...topItem,
            ...state.items.slice(0, action.payload.sortRank),
            ...state.items.slice(action.payload.sortRank + 1),
          ]
        }
      }
      return state;

    case MOVE_ITEM_UP:
      if (state.items.length > 0) {
        const subject = state.items.slice(action.payload.sortRank, action.payload.sortRank + 1);
        const prevItem = state.items.slice(action.payload.sortRank - 1, action.payload.sortRank);
        return  {
           ...state,
          items:[
            ...state.items.slice(0, action.payload.sortRank - 1),
            ...subject,
            ...prevItem,
            ...state.items.slice(action.payload.sortRank + 1),
          ]
        }
      }
      return state;

    case MOVE_ITEM_DOWN:
      if (state.items.length > action.payload.sortRank) {
        const subject = state.items.slice(action.payload.sortRank, action.payload.sortRank + 1);
        const succItem = state.items.slice(action.payload.sortRank + 1, action.payload.sortRank + 2);
        return {
           ...state,
          items:[
            ...state.items.slice(0, action.payload.sortRank),
            ...succItem,
            ...subject,
            ...state.items.slice(action.payload.sortRank + 2),
          ]
        }
      }
      return state;

    case MOVE_ITEM_BOTTOM:
      if (state.items.length > 0 && state.items.length - 1 !== action.payload.sortRank) {
        const bottomItem = state.items.slice(action.payload.sortRank, action.payload.sortRank + 1);
        return {
           ...state,
          items:[
            ...state.items.slice(0, action.payload.sortRank),
            ...state.items.slice(action.payload.sortRank + 1),
            ...bottomItem,
          ]
        }
      }
      return state;
    default:
      return state;
  }
}