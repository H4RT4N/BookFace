import ACTION_TYPES from "../actions/types";

const initialState = {
  posts: [],
};

export default function Reduce(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.FETCH_ALL:
      return {
        ...state,
        posts: [...action.payload],
      };
    case ACTION_TYPES.CREATE:
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    case ACTION_TYPES.UPDATE:
    case ACTION_TYPES.LIKE:
      return {
        ...state,
        posts: state.posts.map((p) =>
          p._id == action.payload._id ? action.payload : p
        ),
      };
    case ACTION_TYPES.DELETE:
      return {
        ...state,
        posts: state.posts.filter((p) => p._id != action.payload),
      };
    default:
      return state;
  }
}
