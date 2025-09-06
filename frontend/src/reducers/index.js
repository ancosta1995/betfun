import { combineReducers } from "redux";

// Import external reducers
import auth from "./auth";
import chatReducer from './chatReducer';

export default combineReducers({
  auth,
  chat: chatReducer,
});