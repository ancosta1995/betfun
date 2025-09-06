import { TOGGLE_CHAT } from '../actions/types';

const initialState = {
  isOpen: true
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_CHAT:
      return {
        ...state,
        isOpen: action.payload
      };
    default:
      return state;
  }
} 