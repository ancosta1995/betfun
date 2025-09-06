import { TOGGLE_CHAT } from './types';

export const toggleChat = (isOpen) => ({
  type: TOGGLE_CHAT,
  payload: isOpen
});